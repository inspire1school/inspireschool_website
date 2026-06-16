document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('leadForm');
    const phoneInput = document.getElementById('phone');
    const modal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModal');
    const modalMessage = document.getElementById('modalMessage');

    phoneInput.addEventListener('focus', function() {
        if (this.value === '') {
            this.value = '+380';
        }
    });

    phoneInput.addEventListener('input', function() {
        if (!this.value.startsWith('+380')) {
            if (this.value === '+38' || this.value === '+3' || this.value === '+') {
                this.value = '+380';
            } else if (this.value.length === 0) {
                 this.value = '';
            } else {
                 this.value = '+380';
            }
        }
        
        this.value = this.value.replace(/[^\d+]/g, '');
        
        if (this.value.length > 13) {
            this.value = this.value.slice(0, 13);
        }
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const telegram = document.getElementById('telegram').value;
        const level = document.getElementById('level').value;

        if(phone.length < 13) {
            alert('Будь ласка, введіть повний номер телефону.');
            return;
        }

        if(name && phone && telegram && level) {
            const formData = {
                name: name,
                phone: phone,
                user: telegram,
                level: level
            };

            const webhookUrl = 'https://events.sendpulse.com/events/id/40cdf4f2d93f4274c343aadc90a2c821/9440490';

            fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if(response.ok) {
                    modalMessage.innerHTML = `Дякуємо, <strong>${name}</strong>!<br>Ми напишемо вам у Telegram (${telegram}) або зателефонуємо на номер ${phone} найближчим часом.`;
                    modal.classList.add('active');
                    form.reset();
                } else {
                    alert('Сталася помилка при передачі даних. Спробуйте ще раз.');
                }
            })
            .catch(error => {
                console.error('Помилка відправки:', error);
                alert('Не вдалося з\'єднатися з сервером. Перевірте інтернет.');
            });
        }
    });

    closeModalBtn.addEventListener('click', function() {
        modal.classList.remove('active');
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });
});