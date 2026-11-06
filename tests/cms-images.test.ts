import { afterEach, describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";
import { syncImages } from "../scripts/assets/fetch";
import { processContentfulData } from "../scripts/content/process";
import { getAssetFileName } from "../scripts/util/file";
import { IMAGE_SIZES } from "../src/config";
import { getImageName } from "../src/lib/helpers/image";
import { getImage } from "../src/lib/server/jsonld.helpers";

const directories: string[] = [];

afterEach(async () => {
	await Promise.all(
		directories
			.splice(0)
			.map((directory) =>
				rm(directory, { recursive: true, force: true }),
			),
	);
});

async function createDirectory(): Promise<string> {
	const directory = await mkdtemp(
		path.join(tmpdir(), "mikrouli-cms-images-"),
	);
	directories.push(directory);
	return directory;
}

const asset = {
	sys: { id: "image", type: "Asset" },
	fields: {
		title: "Image title",
		description: "Image description",
		file: {
			url: "//images.ctfassets.net/space/asset/hash/untitled_folder_2_pexels-cup-of-couple-6632859.jpg",
			fileName: "untitled folder 2/pexels-cup-of-couple-6632859.jpg",
			contentType: "image/jpeg",
			details: { size: 100, image: { width: 800, height: 600 } },
		},
	},
};

describe("canonical asset filenames", () => {
	test.each([
		["//images.ctfassets.net/a/photo.jpg", "photo.jpg"],
		["https://images.ctfassets.net/a/photo.jpg", "photo.jpg"],
		["https://images.ctfassets.net/a/photo.jpg?v=1", "photo.jpg"],
		["https://images.ctfassets.net/a/photo.name.jpg", "photo.name.jpg"],
		["https://images.ctfassets.net/a/photo%20name.jpg", "photo%20name.jpg"],
		["https://images.ctfassets.net/a/photo name.jpg", "photo%20name.jpg"],
		["https://images.ctfassets.net/a/photo-\u03b1.jpg", "photo-%CE%B1.jpg"],
		["https://images.ctfassets.net/a/photo,name.jpg", "photo,name.jpg"],
	])("%s uses filename %s", (url, expected) => {
		expect(getAssetFileName(url)).toBe(expected);
	});

	test.each([
		"not-a-url",
		"/relative/photo.jpg",
		"https://images.ctfassets.net/",
		"https://images.ctfassets.net/a/",
		"file:///tmp/photo.jpg",
	])("rejects invalid asset URL %s", (url) => {
		expect(() => getAssetFileName(url)).toThrow();
	});
});

describe("CMS image import", () => {
	test("normalizes images in posts, nested sections and children without changing raw data", () => {
		const child = {
			sys: { id: "child", type: "Entry" },
			fields: { title: "Child", slug: "child", heroImage: asset },
		};
		const section = {
			sys: { id: "section", type: "Entry" },
			fields: {
				title: "Section",
				id: "section",
				content: "Text",
				image: asset,
			},
		};
		const data = {
			posts: [
				{
					sys: { id: "post", type: "Entry" },
					fields: { title: "Post", slug: "post", heroImage: asset },
				},
			],
			pages: [
				{
					sys: { id: "page", type: "Entry" },
					fields: {
						title: "Page",
						slug: "page",
						sections: [section],
						children: [child],
					},
				},
			],
			sections: [section],
		};
		const snapshot = structuredClone(data);
		const result = processContentfulData(data);
		const expectedImage = {
			...asset.fields,
			file: {
				...asset.fields.file,
				fileName: "untitled_folder_2_pexels-cup-of-couple-6632859.jpg",
			},
		};

		expect(result.posts[0].fields.heroImage).toEqual(expectedImage);
		expect(result.pages[0].fields.sections?.[0].image).toEqual(
			expectedImage,
		);
		expect(result.pages[0].fields.children?.[0].heroImage).toEqual(
			expectedImage,
		);
		expect(result.sections[0].fields.image).toEqual(expectedImage);
		expect(result.images).toEqual([asset.fields.file.url]);
		expect(data).toEqual(snapshot);
		expect(getImageName(expectedImage.file.fileName)).toBe(
			"untitled_folder_2_pexels-cup-of-couple-6632859",
		);
	});

	test("preserves ordinary images and non-image asset fields", () => {
		const ordinaryImage = {
			...asset,
			fields: {
				...asset.fields,
				file: {
					...asset.fields.file,
					url: "//images.ctfassets.net/a/photo.jpg",
					fileName: "photo.jpg",
				},
			},
		};
		const document = {
			sys: { id: "document", type: "Asset" },
			fields: {
				file: {
					url: "//assets.ctfassets.net/a/document.pdf",
					fileName: "Original.pdf",
					contentType: "application/pdf",
				},
			},
		};
		const result = processContentfulData({
			posts: [
				{
					sys: { id: "post", type: "Entry" },
					fields: {
						title: "Post",
						heroImage: ordinaryImage,
						document,
					},
				},
			],
		});
		expect(result.posts[0].fields).toMatchObject({
			title: "Post",
			heroImage: ordinaryImage.fields,
			document: document.fields,
		});
	});

	test("rejects images with missing or invalid URLs", () => {
		for (const url of [
			undefined,
			"not-a-url",
			"https://images.ctfassets.net/",
		]) {
			expect(() =>
				processContentfulData({
					posts: [
						{
							sys: { id: "post", type: "Entry" },
							fields: {
								heroImage: {
									...asset,
									fields: {
										...asset.fields,
										file: { ...asset.fields.file, url },
									},
								},
							},
						},
					],
				}),
			).toThrow();
		}
	});

	test("JSON-LD URLs encode canonical filenames as filesystem names", () => {
		const image = {
			...asset.fields,
			file: {
				...asset.fields.file,
				fileName: "photo.name%20encoded.jpg",
			},
		};
		expect(getImage(image)).toMatchObject({
			url: "https://mikrouli.org/images/cms/photo.name%2520encoded-320.webp",
		});
		expect(
			getImage({
				...image,
				file: { ...image.file, fileName: "photo,name.jpg" },
			}),
		).toMatchObject({
			url: "https://mikrouli.org/images/cms/photo,name-320.webp",
		});
		expect(getImage(undefined)).toBeUndefined();
	});
});

test("asset sync and optimization preserve canonical filenames and remove stale variants", async () => {
	const directory = await createDirectory();
	const inputDirectory = path.join(directory, "images/cms");
	const outputDirectory = path.join(directory, "static/images/cms");
	const dataPath = path.join(directory, "src/data/generated/images.json");
	const fileName = "photo.name%20encoded.jpg";
	const image = await sharp({
		create: { width: 2, height: 2, channels: 3, background: "#ffffff" },
	})
		.jpeg()
		.toBuffer();
	let requests = 0;
	const server = Bun.serve({
		port: 0,
		hostname: "127.0.0.1",
		fetch() {
			requests++;
			return new Response(image, {
				headers: { "Content-Type": "image/jpeg" },
			});
		},
	});

	try {
		await Bun.write(
			dataPath,
			JSON.stringify([`${server.url}assets/${fileName}?v=1`]),
		);
		await syncImages(inputDirectory, dataPath);
		expect(await readdir(inputDirectory)).toEqual([fileName]);
		await Bun.write(path.join(inputDirectory, "unused.jpg"), image);
		await syncImages(inputDirectory, dataPath);
		expect(requests).toBe(1);
		expect(await readdir(inputDirectory)).toEqual([fileName]);

		await mkdir(outputDirectory, { recursive: true });
		await Bun.write(path.join(outputDirectory, "removed-320.webp"), image);
		await Bun.write(
			path.join(outputDirectory, "photo.name%20encoded-123.webp"),
			image,
		);
		await Bun.write(path.join(outputDirectory, "invalid.webp"), image);
		const processResult = Bun.spawn(
			[
				process.execPath,
				"run",
				path.resolve("scripts/assets/process.ts"),
				"--cms",
			],
			{
				cwd: process.cwd(),
				env: { ...process.env, BASE_DIR: directory },
				stdout: "pipe",
				stderr: "pipe",
			},
		);
		const [stdout, stderr, exitCode] = await Promise.all([
			new Response(processResult.stdout).text(),
			new Response(processResult.stderr).text(),
			processResult.exited,
		]);
		expect({ exitCode, stdout, stderr }).toMatchObject({ exitCode: 0 });
		expect(stdout).toContain("Generated 7 new cms images");
		expect((await readdir(outputDirectory)).sort()).toEqual(
			IMAGE_SIZES.map(
				(size) => `photo.name%20encoded-${size}.webp`,
			).sort(),
		);
		const metadata = await Bun.file(
			path.join(directory, "src/data/generated/meta/images.json"),
		).json();
		expect(metadata.cms["photo.name%20encoded"]).toEqual({
			width: "2",
			height: "2",
			hasAlpha: false,
		});
	} finally {
		server.stop(true);
	}
});
