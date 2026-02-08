// Contact Page – WhatsApp Form Submission
document.addEventListener("DOMContentLoaded", function () {

    const contactForm = document.getElementById("contactForm");
    if (!contactForm) return;

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const subject = document.getElementById("subject").value;
        const message = document.getElementById("message").value.trim();

        const whatsappNumber = "918171828762"; // your number

        const subjectMap = {
            repair: "Repair Service",
            purchase: "Phone Purchase",
            inquiry: "General Inquiry",
            complaint: "Complaint",
            feedback: "Feedback"
        };

        const readableSubject = subjectMap[subject] || subject;

        const whatsappMessage =
            `📩 *New Contact Form Message*\n\n` +
            `👤 Name: ${name}\n` +
            `📧 Email: ${email}\n` +
            `📞 Phone: ${phone}\n` +
            `📌 Subject: ${readableSubject}\n\n` +
            `💬 Message:\n${message}`;

        const whatsappURL =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

        window.open(whatsappURL, "_blank");

        contactForm.reset();
    });

});
