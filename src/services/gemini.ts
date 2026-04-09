import { GoogleGenerativeAI } from "@google/generative-ai";

// ده المفتاح الجديد اللي أنت لسه مطلعه - مبروك يا هندسة!
const ai = new GoogleGenerativeAI("AIzaSyAyycUxbxCvfxk1RNc-61JHlxCjnVRGBVM");

const SYSTEM_PROMPT = `
أنت خبير تسويق متخصص في السوق المصري.
مهمتك هي كتابة بوستات تسويقية جذابة جداً بالعامية المصرية فقط.
يجب أن يكون الأسلوب:
1. فكاهي أو عاطفي أو حماسي حسب نوع المنتج.
2. يستخدم كلمات دارجة ومحبوبة في الشارع المصري (زي: "يا بلاش"، "الحق العرض"، "شياكة"، "عظمة"، "فرصة ما تتعوضش").
3. يتضمن "Call to Action" واضح (زي: "ابعتلنا رسالة"، "كلمنا على رقم...").
4. يستخدم الإيموجي بشكل مناسب.
5. يركز على المميزات اللي بتهم المصريين (السعر، الجودة، الشياكة).

ممنوع استخدام اللغة العربية الفصحى تماماً.
ممنوع كتابة أي شيء غير البوست التسويقي.
`;

export async function generateMarketingPost(productName: string, productDescription?: string, imageBase64?: string) {
  // بنجهز الطلب للذكاء الاصطناعي
  let prompt = `اكتب بوست تسويقي لمنتج اسمه: ${productName}.`;
  if (productDescription) {
    prompt += ` وصف المنتج: ${productDescription}`;
  }

  const parts: any[] = [{ text: prompt }];

  // لو فيه صورة، بنبعتها مع الكلام
  if (imageBase64) {
    const base64Data = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Data,
      },
    });
  }

  try {
    // بننادي الموديل المستقر (Flash) عشان يدينا أحسن وأسرع نتيجة
    const model = ai.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT 
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
    });

    return result.response.text();
  } catch (error) {
    console.error("AI Error:", error);
    return "يا بطل حصل مشكلة بسيطة، جرب تدوس على الزرار تاني كدة!";
  }
}
