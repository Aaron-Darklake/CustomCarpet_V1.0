'use client'
import React, { useState } from 'react';
import Section from '../../structure/section';
import Container from '../../structure/container';
import Icon from '../../utils/icon.util';
import contact from './contact.module.scss';
import button from '../../../styles/blocks/button.module.scss';
import SectionTitle from '../../../components/blocks/section.title.block';
import { sendEmail } from '@/app/actions/sendEmail';

const Contact: React.FC = () => {
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('General');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    subject: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubjectSelection = (subject: string) => {
    setSelectedSubject(subject);
    setFormData({
      ...formData,
      subject: subject // Update the subject field
    });
  };

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Construct data object
      const data = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      };

      // Call the server action
      const response = await sendEmail(data);
      if (response?.success === true) {
        setSuccess(true);
        // Reset form data
        setFormData({
          firstName: '',
          lastName: '',
          subject: '',
          email: '',
          message: ''
        });
        setTimeout(() => {
			setLoading(false)
			setSuccess(false);
		  }, 7000);
      } else {
        // Handle response error
        console.error('Error sending message');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

      

    return (
        <div >
            <Section classProp={`${contact.section}`}>
			<div className={contact.container}>
			<div id='contact' />
            <SectionTitle
			preTitle="Reach out to us"
  			title="Contact"
  			subTitle="We're here to assist you. Whether you have questions, feedback, or business inquiries, feel free to get in touch. We'll respond promptly and provide the support you need!"
			
		/>
		<div />
      <div className={contact.contactSection} >
		  <div className={contact.contactGrid}>
			<div className={contact.contactForm}>
			{success ? (
  		<div className={contact.success_message}>
    	<Icon icon={['far', 'check-circle']} />
  		<p>Thank you for contacting us!</p>
  		<p>We recieved your message and will come back to you as soon as possible.</p>
  		<p>Your TechHaven. Team 😊</p>
 		 </div>
		) : (
			<>
				<div className={contact.contactHeader}>
			  <p>Kontakt</p>
			  </div>
			  <form onSubmit={handleSubmit}>
			  <div className={contact.formGroup2}>
          <div className={contact.nameWrapper}>
          <label htmlFor="name">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder='Vorname'
                      required
                    />
                    </div>
                    <div className={contact.nameWrapper}>
                    <label htmlFor="name">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder='Nachname'
                      required
                    />
                    </div>
                  </div>
				  <div className={contact.formGroup}>
                    <label htmlFor="subject">Subject</label>
                    <div className={contact.subjectButtons}>
					<label htmlFor="subject1" style={{fontWeight: 100}} className={`${contact.subjectLabel} ${selectedSubject === 'General' ? contact.selectedSubjectLabel : ''}`}>
    <input
      type="radio"
      id="subject1"
      name="subject"
      value="General"
      checked={selectedSubject === 'General'}
      onChange={() => handleSubjectSelection('General')}
    />
    General
  </label>

  <label htmlFor="subject2" style={{fontWeight: 100}} className={`${contact.subjectLabel} ${selectedSubject === 'Booking' ? contact.selectedSubjectLabel : ''}`}>
    <input
      type="radio"
      id="subject2"
      name="subject"
      value="Booking"
      checked={selectedSubject === 'Booking'}
      onChange={() => handleSubjectSelection('Booking')}
    />
    Booking
  </label>

  <label htmlFor="subject3" style={{fontWeight: 100}} className={`${contact.subjectLabel} ${selectedSubject === 'Sponsoring' ? contact.selectedSubjectLabel : ''}`}>
    <input
      type="radio"
      id="subject3"
      name="subject"
      value="Sponsoring"
      checked={selectedSubject === 'Sponsoring'}
      onChange={() => handleSubjectSelection('Sponsoring')}
    />
    Sponsoring
  </label>

  <label htmlFor="subject4" style={{fontWeight: 100}} className={`${contact.subjectLabel} ${selectedSubject === 'Others' ? contact.selectedSubjectLabel : ''}`}>
    <input
      type="radio"
      id="subject4"
      name="subject"
      value="Others"
      checked={selectedSubject === 'Others'}
      onChange={() => handleSubjectSelection('Others')}
    />
    Others
  </label>

</div>
                  </div>
				  <div className={contact.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder='mail@beispiel.de'
                    />
                  </div>
				  <div className={contact.formGroup}>
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder='Geben Sie hier Ihre Nachricht ein'
					  rows={4}
                    />
                  </div>
				  <button className={`button ${button.primary}`} type="submit" disabled={loading}>
  					{loading ? 'Sending message...' : 'Send Message'}
				 </button>
			  </form>
			  </>
			  )}
			</div>
			
			
		  </div>
		  
		  <div className={contact.contactArea}>
			<div className={contact.contactCompany}>
				<div className={contact.contactCompanyHeader}>
				<h3>TechHaven.</h3>
				{/*<p>{`GmbH`}</p>*/}
				</div>
				<div className={contact.companyAdress}>
				<Icon  icon={['fas', 'location-dot']} />
				<div className={contact.companyAdressDetails}>
				<p> Haupt Straße 1</p>
				<p> 01234 - Stadt</p>
				<p> Land</p>
				</div>
				</div>
				{/*<div className={contact.companyMail}>
				<Icon  icon={['fas', 'phone']} />
				<a></a>
				</div>*/}
				<div className={contact.companyMail}>
				<Icon  icon={['fas', 'envelope']} />
				<a href="mailto:thehelhein@gmail.com" >support@mail.domain</a>
				</div>
                <div className={contact.socialIcons}>
					<div className={contact.socialIconsHeader}>
					<p>Let´s connect</p>
					</div>
					<div className={contact.socialIconsContainer}>
					<div className={contact.icon}>
					<a href="mailto:contact@darklake.me" className={contact.mail} >
                  <Icon  icon={['fas', 'envelope']} />
				  </a>
				 	 <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className={contact.facebook}>
						<Icon  icon={['fab', 'facebook']} />
           		 	</a>
					<a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className={contact.instagram}>
						<Icon icon={['fab', 'instagram']} />
            		</a>
					<a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className={contact.youtube}>
						<Icon icon={['fab', 'youtube']} />
           		    </a>
					</div>
				  </div>
				  
                </div>
				
			</div>
			{/*	*/}
		  </div>
		  </div>
			</div>
            </Section>
      </div>
    );
  }

export default Contact;
