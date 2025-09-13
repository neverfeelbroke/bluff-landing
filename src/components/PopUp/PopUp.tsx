import { useState, useEffect } from 'react';
import styles from './PopUp.module.css'

interface PopUpProps {
    isVisible: boolean;
    onClose: () => void;
}

export default function PopUp({ isVisible, onClose }: PopUpProps) {
    const [email, setEmail] = useState("");
    const [shouldRender, setShouldRender] = useState(false);
    const [isAnimatingIn, setIsAnimatingIn] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setShouldRender(true);
            // Сброс состояний при открытии окна
            setIsSubmitting(false);
            setIsSuccess(false);
            // Небольшая задержка для запуска анимации появления
            setTimeout(() => {
                setIsAnimatingIn(true);
            }, 10);
        } else {
            setIsAnimatingIn(false);
            // Задержка для анимации исчезновения
            setTimeout(() => {
                setShouldRender(false);
                // Сброс состояний при закрытии окна
                setIsSubmitting(false);
                setIsSuccess(false);
            }, 300);
        }
    }, [isVisible]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Предотвращаем повторную отправку
        if (isSubmitting || isSuccess) return;
        
        setIsSubmitting(true);
        console.log("Введённый email:", email);

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Ошибка при отправке');
            }

            const data = await response.json();
            console.log('Ответ от сервера:', data.message);

            // Установить состояние успеха
            setIsSuccess(true);
            setIsSubmitting(false);
            
            // очистить email
            setEmail('');

            // Автоматически закрыть окно через 2 секунды
            setTimeout(() => {
                onClose();
            }, 5000);

        } catch (error) {
            console.error('Ошибка отправки формы:', error);
            setIsSubmitting(false);
            alert('Произошла ошибка. Попробуйте позже.');
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!shouldRender) {
        return null;
    }

    return (
        <div 
            className={`${styles['pop-up']} ${isAnimatingIn ? styles['visible'] : styles['hidden']}`}
            onClick={handleBackdropClick}
        >
            <div className={`${styles['form-wrapper']} ${isAnimatingIn ? styles['form-visible'] : styles['form-hidden']}`}>
                <div className={styles['logo']}>
                    <img src="/logo.svg" alt="logo"/>
                </div>
                
                {isSuccess ? (
                    <div className={styles['success-message']}>
                        <p>All good!</p>
                        <p className={styles['success-text']}>You've been added to the waitlist!</p>
                    </div>
                ) : (
                    <div className={styles['wrapper']}>
                        <p>Join the waitlist</p>
                        <form
                            onSubmit={handleSubmit}
                            className={styles['form']}
                        >
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                disabled={isSubmitting}
                                className={`${styles['field']} ${isSubmitting ? styles['field-disabled'] : ''}`}
                            />

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`${styles['submit']} ${isSubmitting ? styles['submit-loading'] : ''}`}
                            >
                                {isSubmitting ? (
                                    <div className={styles['spinner']}></div>
                                ) : (
                                    <img src="/submit.svg" alt="Submit" />
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}