export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio") as File;

    if (!audio) {
      return Response.json(
        { error: "No audio file received" },
        { status: 400 },
      );
    }

    const sarvamForm = new FormData();
    sarvamForm.append("file", audio, audio.name || "audio.webm");
    sarvamForm.append("model", "saaras:v3");
    sarvamForm.append("mode", "codemix");

    const response = await fetch("https://api.sarvam.ai/speech-to-text", {
      method: "POST",
      headers: {
        "api-subscription-key": process.env.SARVAM_API_KEY!,
      },
      body: sarvamForm,
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error(`Sarvam error ${response.status}:`, errBody);
      throw new Error(`Sarvam error: ${response.status}`);
    }

    const data = await response.json();
    return Response.json({ transcript: data.transcript });
  } catch (error) {
    console.error("SARVAM tracript error : ", error);
    return Response.json({ error: "Transcription failed" }, { status: 500 });
  }
}
