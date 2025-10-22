# I AM MUSIC 🎶

**I AM MUSIC** is a web application that allows users to read song lyrics and receive **AI-generated interpretations** of each line. By clicking on any line, users can see an annotation explaining the possible meaning behind the lyrics, based on the song’s context.

---

## 📦 Installation and Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/AidaDaniyarova/iammusic.git
   cd iam-music
   ```

2. **Backend (Django + DRF)**:

   ```bash
   cd iam_music
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

3. **Frontend (React + Tailwind CSS)**:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Hugging Face API Integration**:

   * Get your API token from [Hugging Face](https://huggingface.co/settings/tokens)
   * Create a `.env` file in the frontend root:

     ```
     VITE_HF_TOKEN=your_token
     ```

5. **Run the Application**:

   ```bash
   cd frontend
   npm start
   ```

---

## 🛠️ Architecture

* **Frontend:** React + TailwindCSS
* **Backend:** Django + Django REST Framework
* **Database:** PostgreSQL
* **AI Integration:** Hugging Face Inference API (e.g., `google/flan-t5-large`)
* **Functionality:** Real-time lyric annotation on line click
* **Communication:** REST API between frontend and backend

---

## 🧠 Unique Features

* 🎤 **AI Lyric Interpretation:** Clicking on any lyric line triggers an API request to Hugging Face, generating a contextual interpretation.
* ✨ **Semantic Line Segmentation:** Each lyric line is isolated and interactive for precise annotations.
* 🔄 **UI/UX and NLP Integration:** Combines intuitive user interaction with powerful NLP models for a seamless learning experience.

---

## ⚖️ Trade-offs

* Used **Hugging Face API** instead of building a custom ML model to accelerate development.
* Skipped SSR (Next.js) in favor of **CRA + TailwindCSS** for simplicity.
* **FLAN-T5** provides strong interpretations but can be slow; future plans include deploying a fine-tuned local model.

---

## 🐞 Known Issues

* 🔁 Annotation generation can take up to 3 seconds.
* 📵 Fails gracefully if offline or if the Hugging Face token is invalid.
* ⚠️ No response caching yet — identical lines may trigger repeated API calls.

---

## 💡 Why This Stack?

| Component        | Reason for Choice                                                      |
| ---------------- | ---------------------------------------------------------------------- |
| **Django + DRF** | Reliable architecture, rapid development, built-in admin panel         |
| **React**        | Flexible, responsive UI and intuitive state management                 |
| **TailwindCSS**  | Fast styling, adaptability, modular design                             |
| **PostgreSQL**   | Reliable and efficient for handling text-based data                    |
| **Hugging Face** | Easy access to state-of-the-art NLP models without additional training |

---

