import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-slate-50 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold mb-6 text-slate-800">Privacy Policy</h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="mb-4">
              At SamaBrains, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your information when you use our TikTok Downloader service.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Information We Collect</h2>
            <p>
              When you use our service, we may collect the following information:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Usage Data:</strong> Information about how you access and use our service, including the URLs you submit, the videos you download, your IP address, browser type, and operating system.</li>
              <li><strong>Cookies and Similar Technologies:</strong> We use cookies and similar tracking technologies to track activity on our service and store certain information.</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">2. How We Use Your Information</h2>
            <p>
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To allow you to participate in interactive features when you choose to do so</li>
              <li>To monitor the usage of our service</li>
              <li>To detect, prevent, and address technical issues</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">3. Data Storage and Security</h2>
            <p>
              We do not permanently store the videos you download or the TikTok URLs you submit. Once your session is complete, this data is automatically deleted from our servers. We implement appropriate security measures to protect your information from unauthorized access, alteration, disclosure, or destruction.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">4. Third-Party Services</h2>
            <p>
              We may employ third-party companies and individuals to facilitate our service, provide the service on our behalf, perform service-related services, or assist us in analyzing how our service is used. These third parties have access to your information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">5. Children's Privacy</h2>
            <p>
              Our service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">6. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> info@samabrains.com<br />
              <strong>Phone:</strong> +256 759 910 596<br />
              <strong>Address:</strong> Kampala, Uganda
            </p>
            
            <p className="mt-8 text-sm text-slate-500">
              Last Updated: May 5, 2025
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}