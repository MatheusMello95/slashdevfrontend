## 🚀 Configuration and Execution
### **1️⃣ Clone the repository**
```
git clone https://github.com/MatheusMello95/slashdevfrontend.git
cd slashdevfrontend
```
### **2️⃣ Install dependencies**
```
npm install
```
## To connect to the backend, you need to define the URL where your server will host the backend application.

### **3️⃣ Create a file in the root folder using the following command:**
```
echo "" > .env.local
```

### **4️⃣ Then open the file and add the following text to it (changing the URL_HERE to the URL where your backend application is running)**
```
# API URL - update this to match your Laravel backend URL
NEXT_PUBLIC_API_URL=URL_HERE
```

### **5️⃣ Then run the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.



