document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('leadForm');
    const phoneInput = document.getElementById('phone');
    const modal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModal');
    const modalMessage = document.getElementById('modalMessage');

    // Логіка слайдера відгуків
    const slider = document.getElementById('reviewsSlider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (slider && prevBtn && nextBtn) {
        // Прокрутка на одну картку (приблизно 380px)
        prevBtn.addEventListener('click', () => {
            slider.scrollBy({ left: -380, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            slider.scrollBy({ left: 380, behavior: 'smooth' });
        });
    }

    // Форматування номера телефону
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

    // Обробка відправки форми
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        let telegram = document.getElementById('telegram').value;
        const level = document.getElementById('level').value;

        // Автоматичне додавання @ до Telegram ніка
        if (!telegram.startsWith('@') && !telegram.includes('http')) {
            telegram = '@' + telegram;
        }

        if(phone.length < 13) {
            alert('Будь ласка, введіть повний номер телефону.');
            return;
        }

        // Анімація кнопки "Відправка..."
        const submitBtn = form.querySelector('.btn-submit');
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = 'Відправка...';
        submitBtn.disabled = true;

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
            })
            .finally(() => {
                // Повертаємо кнопку в нормальний стан
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
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