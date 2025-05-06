import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-slate-50 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold mb-6 text-slate-800">Terms of Service</h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="mb-4">
              Welcome to TikSave by SamaBrains. By using our service, you agree to comply with and be bound by the following terms and conditions.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the TikSave service, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">2. Description of Service</h2>
            <p>
              TikSave provides a service that allows users to download TikTok videos without watermarks for personal use only. The service processes publicly available TikTok videos and provides them in various formats.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">3. User Responsibilities</h2>
            <p>
              When using our service, you agree:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>To use the service for personal, non-commercial purposes only</li>
              <li>Not to violate any laws or regulations in your jurisdiction</li>
              <li>Not to infringe upon the intellectual property rights of others</li>
              <li>Not to use the service to download content that is illegal, harmful, threatening, abusive, harassing, or otherwise objectionable</li>
              <li>Not to attempt to circumvent, disable or interfere with security-related features of the service</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">4. Intellectual Property Rights</h2>
            <p>
              Our service respects the intellectual property rights of others. Users are responsible for ensuring they have the right to download and use any content they access through our service. The videos available through TikTok are the property of their respective owners.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">5. Limitation of Liability</h2>
            <p>
              TikSave provides the service on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding the reliability, accuracy, or availability of the service. In no event shall SamaBrains be liable for any indirect, incidental, special, or consequential damages arising out of or in any way connected with the use of our service.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">6. Service Modifications</h2>
            <p>
              We reserve the right to modify or discontinue the service, temporarily or permanently, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">7. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of Uganda, without regard to its conflict of law provisions.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">8. Changes to Terms</h2>
            <p>
              We reserve the right to update or modify these Terms of Service at any time without prior notice. Your continued use of the service after any changes indicates your acceptance of the new Terms.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">9. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
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