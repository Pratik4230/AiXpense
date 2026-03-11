---

title: Sarvam Vision
description: >-
Sarvam Vision - A 3B parameter multimodal model delivering world-class
Document Intelligence and visual understanding with unmatched accuracy for 23
languages (22 Indian + English).
canonical-url: '[https://docs.sarvam.ai/api-reference-docs/models/sarvam-vision](https://docs.sarvam.ai/api-reference-docs/models/sarvam-vision)'
'og:title': Sarvam Vision - Document Intelligence Model by Sarvam AI
'og:description': >-
Sarvam Vision 3B parameter multimodal model for Document Intelligence. SOTA
performance on global benchmarks with unrivaled mastery of 23 languages (22
Indian + English).
'og:type': article
'og:site_name': Sarvam AI Developer Documentation
'og:image':
type: url
value: >-
[https://res.cloudinary.com/dvcb20x9a/image/upload/v1743510800/image_3_rpnrug.png](https://res.cloudinary.com/dvcb20x9a/image/upload/v1743510800/image_3_rpnrug.png)
'og:image:width': 1200
'og:image:height': 630
'twitter:card': summary_large_image
'twitter:title': Sarvam Vision - Document Intelligence Model by Sarvam AI
'twitter:description': >-
Sarvam Vision 3B parameter multimodal model for Document Intelligence. SOTA
performance on global benchmarks with unrivaled mastery of 23 languages (22
Indian + English).
'twitter:image':
type: url
value: >-
[https://res.cloudinary.com/dvcb20x9a/image/upload/v1743510800/image_3_rpnrug.png](https://res.cloudinary.com/dvcb20x9a/image/upload/v1743510800/image_3_rpnrug.png)
'twitter:site': '@SarvamAI'

---

**Sarvam Vision** is a 3B parameter state-space Vision Language Model (VLM) purpose-built for high-accuracy Document Intelligence. It powers our Document Intelligence pipeline.

## Why Sarvam Vision?

One of the most challenging problems in vision AI today is accurate document intelligence for Indian languages. Much of India's knowledge—historical texts, government records, academic papers, and cultural archives—remains locked in libraries, scanned collections, and legacy documents. Unlocking this vast repository is essential for preserving cultural heritage and making knowledge accessible.

While frontier Vision Language Models have set a high bar for processing modern English documents, a significant gap remains: most global models treat Indian languages as secondary, often resulting in lower accuracy for regional scripts. **Sarvam Vision bridges this gap** with native support for 22 Indian languages, delivering world-class accuracy where others fall short.

<Note>
  Want to learn more about how we built Sarvam Vision? Check out our [blog post](https://www.sarvam.ai/blogs).
</Note>

---

## What You Can Do

- **Text Extraction**: Extract text from PDFs and scanned documents in 23 languages (22 Indian + English)
- **Tables**: Convert complex tables to HTML or Markdown
- **Structure Preservation**: Maintain document layout, reading order, and hierarchies

---

## Supported Languages

All 22 official Indian languages plus English:

| Language  | Code    | Language | Code     | Language | Code     |
| --------- | ------- | -------- | -------- | -------- | -------- |
| Hindi     | `hi-IN` | Assamese | `as-IN`  | Konkani  | `kok-IN` |
| Bengali   | `bn-IN` | Urdu     | `ur-IN`  | Maithili | `mai-IN` |
| Tamil     | `ta-IN` | Sanskrit | `sa-IN`  | Sindhi   | `sd-IN`  |
| Telugu    | `te-IN` | Nepali   | `ne-IN`  | Kashmiri | `ks-IN`  |
| Marathi   | `mr-IN` | Dogri    | `doi-IN` | Manipuri | `mni-IN` |
| Gujarati  | `gu-IN` | Bodo     | `brx-IN` | Santali  | `sat-IN` |
| Kannada   | `kn-IN` | Punjabi  | `pa-IN`  | English  | `en-IN`  |
| Malayalam | `ml-IN` | Odia     | `od-IN`  |          |          |

---

## Capabilities

<Tabs>
  <Tab title="Text Extraction">
    <div>
      <h3>
        High-Fidelity Document Intelligence
      </h3>

      <p>
        Sarvam Vision extracts text from documents with exceptional accuracy, preserving the original structure and reading order across 23 languages (22 Indian + English).
      </p>
    </div>

    **Features:**

    * High-accuracy text extraction from PDFs and scanned documents
    * Preserves document layout and reading order
    * Native support for all Indian scripts
    * Outputs clean HTML or Markdown

  </Tab>

  <Tab title="Tables">
    <div>
      <h3>
        Mastering Complex Tables
      </h3>

      <p>
        Financial reports and scientific papers are notorious for complex tables—merged cells, multi-level headers, and invisible borders. Where traditional tools scramble this data into a jumbled mess, Sarvam Vision understands the spatial relationships.
      </p>
    </div>

    **Features:**

    * Preserves row/column structure perfectly
    * Handles merged cells and multi-level headers
    * Supports invisible borders and complex layouts
    * Outputs clean HTML or Markdown tables

  </Tab>

  <Tab title="Multilingual">
    <div>
      <h3>
        End-to-End Indic Support
      </h3>

      <p>
        Unlike other models that force translation to English, Sarvam Vision supports both input and output in all 23 languages (22 Indian + English).
      </p>
    </div>

    **Examples:**

    * Marathi financial report → Structured Marathi content
    * Tamil official document → Tamil structured output
    * Bengali textbook → Full Bengali structured output

  </Tab>
</Tabs>

---

## Quick Start

Get started with Document Intelligence with high-fidelity text extraction across all supported languages.

<CodeGroup>
  <CodeBlock title="Python" active>
    ```python
    from sarvamai import SarvamAI

    client = SarvamAI(
        api_subscription_key="YOUR_SARVAM_API_KEY"
    )

    # Create a document intelligence job
    job = client.document_intelligence.create_job(
        language="hi-IN",
        output_format="md"
    )
    print(f"Job created: {job.job_id}")

    # Upload document
    job.upload_file("document.pdf")
    print("File uploaded")

    # Start processing
    job.start()
    print("Job started")

    # Wait for completion
    status = job.wait_until_complete()
    print(f"Job completed with state: {status.job_state}")

    # Get processing metrics
    metrics = job.get_page_metrics()
    print(f"Page metrics: {metrics}")

    # Download output (ZIP file containing the processed document)
    job.download_output("./output.zip")
    print("Output saved to ./output.zip")
    ```

  </CodeBlock>

  <CodeBlock title="JavaScript">
    ```javascript
    import { SarvamAIClient } from "sarvamai";

    const client = new SarvamAIClient({
        apiSubscriptionKey: "YOUR_SARVAM_API_KEY"
    });

    async function main() {
        // Create a document intelligence job
        const job = await client.documentIntelligence.createJob({
            language: "hi-IN",
            outputFormat: "md"
        });
        console.log(`Job created: ${job.jobId}`);

        // Upload document
        await job.uploadFile("document.pdf");
        console.log("File uploaded");

        // Start processing
        await job.start();
        console.log("Job started");

        // Wait for completion
        const status = await job.waitUntilComplete();
        console.log(`Job completed with state: ${status.job_state}`);

        // Get processing metrics
        const metrics = job.getPageMetrics();
        console.log("Page metrics:", metrics);

        // Download output (ZIP file containing the processed document)
        await job.downloadOutput("./output.zip");
        console.log("Output saved to ./output.zip");
    }

    main();
    ```

  </CodeBlock>
</CodeGroup>

---

## Model Specifications

<Card title="Technical Specifications">
  <ul>
    <li>
      <strong>Model Size</strong>

      : 3B parameters
    </li>

    <li>
      <strong>Supported Input Formats</strong>

      : PDF, PNG, JPG, ZIP (flat archive with JPG/PNG document pages)
    </li>

    <li>
      <strong>Output Formats</strong>

      : HTML, Markdown (md) (delivered as ZIP file)
    </li>

    <li>
      <strong>Languages</strong>

      : 23 languages (22 Indian + English)
    </li>

  </ul>
</Card>

---

## Next Steps

<CardGroup cols={3}>
  <Card title="Developer Quickstart" icon="sparkles" href="/api-reference-docs/api-guides-tutorials/document-intelligence/overview">
    Learn how to integrate Document Intelligence into your application.
  </Card>

  <Card title="API Reference" icon="terminal" href="/api-reference-docs/document-intelligence">
    Complete API documentation for Document Intelligence endpoints.
  </Card>

  <Card title="Try in API Dashboard" icon="play" href="https://dashboard.sarvam.ai">
    Get your API key and start processing documents.
  </Card>
</CardGroup>
