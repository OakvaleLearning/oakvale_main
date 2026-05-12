'use client';
 
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Footer from './Footer';
import { Mail, MapPin, Globe } from 'lucide-react';
  
type Page = 'home' | 'about' | 'services' | 'corporates' | 'academic' | 'donors' | 'government' | 'contact';

interface ContactPageProps {
  onNavigate: (page: Page) => void;
}

export default function ContactPage({ onNavigate }: ContactPageProps) {

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmission = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const loadingToast = toast.loading('Sending your enquiry...');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: (e.target as HTMLFormElement).firstName.value,
          lastName: (e.target as HTMLFormElement).lastName.value,
          organisation: (e.target as HTMLFormElement).organisation.value,
          email: (e.target as HTMLFormElement).email.value,
          enquiryType: (e.target as HTMLFormElement).enquiryType.value,
          message: (e.target as HTMLFormElement).message.value,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Your enquiry has been sent! We will get back to you within 3 working days.', {
          id: loadingToast,
        });
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error(data.error || 'Failed to send enquiry. Please try again.', {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error('Error sending enquiry:', error);
      toast.error('There was an error sending your enquiry. Please try again later.', {
        id: loadingToast,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return ( 
    <div className="pt-[2.5rem]">
      <Toaster position="top-right" />
      <div className="contact-hero pt-10 relative w-full" style={{
      backgroundImage: 'url(/contact.png)',

      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover'
    }}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70 z-5" /> 
      <div className="contact-hero-inner relative z-10"> 
        <h1>Work with Oakvale <em style={{ fontStyle: 'italic', color: 'var(--mint)' }}>Learning</em></h1>
        <p>We work with a small number of institutional partners at any one time. If your project aligns with our areas of expertise, we would like to hear from you.</p>
      </div>
      </div>

      <div className="contact-body">
        <div className="contact-info">
          <h3>Before you get in touch</h3>
          <p>We are best placed to support organisations working on workforce, leadership and organisational development across Africa, particularly where there is intent to build something that lasts rather than deliver a one-off training event. We welcome enquiries at any stage, including early-stage programme scoping and proposal development.</p>
          <div className="contact-detail">
            <div className="contact-detail-icon"><Mail size={20} /></div>
            <div className="contact-detail-text"><small>General Enquiries</small><a href="mailto:hello@oakvaleltd.com">hello@oakvaleltd.com</a></div>
          </div>
          <div className="contact-detail">
            <div className="contact-detail-icon"><MapPin size={20} /></div>
            <div className="contact-detail-text"><small>Base Location</small>United Kingdom and Nigeria</div>
          </div>
          <div className="contact-detail">
            <div className="contact-detail-icon"><Globe size={20} /></div>
            <div className="contact-detail-text"><small>Programme Delivery</small>Africa and the Global South</div>
          </div>
          
        </div>

        <div className="contact-form">
          <h3>Send us a message</h3>
          <p>Tell us about your organisation and what you are working on. We will follow up within 3 working days.</p>
          <form onSubmit={handleSubmission}>
            <div className="form-row">
              <div className="form-group"><label>First Name</label><input type="text" name="firstName" placeholder="Your first name" required /></div>
              <div className="form-group"><label>Last Name</label><input type="text" name="lastName" placeholder="Your last name" required /></div>
            </div>
            <div className="form-group"><label>Organisation</label><input type="text" name="organisation" placeholder="Your organisation name" required /></div>
            <div className="form-group"><label>Email Address</label><input type="email" name="email" placeholder="your@organisation.org" required /></div>
            <div className="form-group">
              <label>Type of Enquiry</label>
              <select name="enquiryType" required>
                <option value="">Select enquiry type...</option>
                <option value="Workforce Development Programme">Workforce Development Programme</option>
                <option value="Organisational & Leadership Development">Organisational &amp; Leadership Development</option>
                <option value="Academic Curriculum Co-Development">Academic Curriculum Co-Development</option>
                <option value="Technology-Enabled Learning">Technology-Enabled Learning</option>
                <option value="Proposal Partnership / Joint Bid">Proposal Partnership / Joint Bid</option>
                <option value="Government / Public Sector Enquiry">Government / Public Sector Enquiry</option>
                <option value="General Partnership Enquiry">General Partnership Enquiry</option>
              </select>
            </div>
            <div className="form-group"><label>Tell us about your project</label><textarea name="message" placeholder="Briefly describe your organisation, the challenge you are working on, and what kind of support you are looking for..." required /></div>
            <button type="submit" className="form-submit" disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Send Enquiry'}</button>
          </form>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
  }
