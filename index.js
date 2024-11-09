const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 7000;

app.use(express.json());
app.use(cors());

const STORAGE_PATH = path.join("/ali_PV_dir");

app.post("/test-processor", (req, res) => {
	return res.status(200).json({ message: "processor says hi" });
});

app.post("/calculate-sum", (req, res) => {
	const { file, product } = req.body;

	if (!file || !product) {
		return res.status(400).json({ file: null, error: "Invalid JSON input." });
	}

	const filePath = path.join(STORAGE_PATH, file);

	if (!fs.existsSync(filePath)) {
		return res.status(404).json({ file, error: "File not found." });
	}
	try {
		const fileContent = fs.readFileSync(filePath, "utf8");

		// Check if the file is in CSV format (simple validation)
		if (!fileContent.includes(",")) {
			throw new Error("Input file not in CSV format.");
		}

		const lines = fileContent.split("\n");

		const total = lines.reduce((sum, line) => {
			const [prod, amount] = line.split(",");

			if (prod && amount) {
				if (prod.trim() === product.trim()) {
					return sum + parseInt(amount.trim(), 10);
				}
			}
			return sum;
		}, 0);

		res.status(200).json({ file, product, sum: total });
	} catch (error) {
		console.error("Error processing the file:", error.message);

		if (error.message === "Input file not in CSV format.") {
			res.status(400).json({
				file,
				error: "Input file not in CSV format.",
			});
		} else {
			res.status(500).json({
				file,
				error: "Unable to process the file.",
			});
		}
	}
});

app.listen(PORT, () => console.log(`Container 2 running on port ${PORT}`));
