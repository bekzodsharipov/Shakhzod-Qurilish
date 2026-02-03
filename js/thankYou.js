async function sendPhoneAndTime() {
  const raw = localStorage.getItem("formData");
  if (!raw) return;

  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error("formData JSON parse error:", e);
    return;
  }

  const phoneRaw = (data?.TelefonRaqam ?? "").toString().trim();
  const timeRaw = (data?.SanaSoat ?? "").toString().trim(); // Royhatdan o'tgan vaqti

  // Telefon validatsiya
  const digits = phoneRaw.replace(/\D/g, "");
  const isValidPhone =
    (phoneRaw.startsWith("+998") && digits.length === 12) ||
    (!phoneRaw.startsWith("+") && digits.length >= 9 && digits.length <= 12);

  if (!isValidPhone) {
    console.warn("Telefon noto‘g‘ri, yuborilmadi:", phoneRaw);
    return;
  }

  // Agar vaqt bo‘sh bo‘lsa, hozirgi vaqtni qo‘yib yuboramiz
  const regTime = timeRaw || new Date().toISOString();

  const formData = new FormData();
  formData.append("sheetName", "Lead");
  formData.append("Telefon raqam", phoneRaw);
  formData.append("Royhatdan o'tgan vaqti", regTime);

  try {
    const res = await fetch(
      "https://script.google.com/macros/s/AKfycbyA3Afv4AWqC_A-p_XcUJoMqJwC6BQAvroAMkIxVzpECewpja7hRcV_3m1qkg01qA9G/exec",
      { method: "POST", body: formData }
    );

    if (!res.ok) throw new Error("API response was not ok");

    localStorage.removeItem("formData");
  } catch (err) {
    console.error("Error submitting form:", err);
    const el = document.getElementById("errorMessage");
    if (el) el.style.display = "block";
  }
}

window.addEventListener("load", sendPhoneAndTime);
