import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw Error("You are now allowed to use this service . . .");
}

export async function POST(req: Request) {
  const body = await req.json();
  console.log(body);

  const {
    gender,
    age,
    height,
    weight,
    bfp,
    sleep,
    exercises,
    frequency,
    purpose,
  } = body;

  if (!gender || !age || !height || !weight || frequency === null || !purpose) {
    return Response.json(
      { error: "Please provide all required information" },
      { status: 400 }
    );
  }

  const prompt = `I am ${age}-year-old SKKU student in South Korea. I'm a ${gender}, ${height}cm tall and weighing ${weight}kg. My body fat percentage is ${bfp}%. I sleep for about ${sleep} hours a day. I do ${exercises}. I workout ${frequency} times a week. I want to get an advice from you. What should I do to accomplish my ultimate purpose of workout, which is ${purpose}`;

  const openai = new OpenAI({ apiKey });

  try {
    const completion = await openai.completions.create({
      model: "text-davinci-003",
      temperature: 0.7,
      prompt,
      max_tokens: 300,
    });

    const response = completion.choices[0].text.trim();
    return Response.json({ response }, { status: 200 });
  } catch (err) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
