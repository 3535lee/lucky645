'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    platform: '',
    account: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission if already loading
    if (loading) return;
    
    // Validate form fields
    if (!formData.name.trim() || !formData.platform.trim() || !formData.account.trim() || !formData.message.trim()) {
      setError(t('contact.error_all_fields'));
      return;
    }

    // Start loading and clear previous errors
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          platform: formData.platform.trim(),
          account: formData.account.trim(),
          message: formData.message.trim()
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Handle API errors
        if (response.status === 500 && responseData.error === 'Telegram configuration is missing') {
          setError(t('contact.error_telegram_config'));
        } else {
          setError(responseData.error || t('contact.error_send_failed'));
        }
      } else {
        // Success case
        setSuccess(true);
        setFormData({ name: '', platform: '', account: '', message: '' });
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError(t('contact.error_network'));
    } finally {
      // Always re-enable the button
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-8">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-4">{t('contact.success_title')}</h2>
          <p className="text-green-600 dark:text-green-300 mb-6">{t('contact.success_message')}</p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            {t('contact.button_new_message')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('contact.title')}</h1>
        <p className="text-gray-700 dark:text-gray-300">{t('contact.subtitle')}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('contact.name_label')}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400"
              placeholder={t('contact.name_placeholder')}
            />
          </div>

          <div>
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('contact.platform_label')}
            </label>
            <select
              id="platform"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
            >
              <option value="">{t('contact.platform_placeholder')}</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Telegram">Telegram</option>
            </select>
          </div>

          <div>
            <label htmlFor="account" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('contact.account_label')}
            </label>
            <input
              type="text"
              id="account"
              name="account"
              value={formData.account}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400"
              placeholder={formData.platform ? t('contact.account_placeholder_dynamic').replace('{platform}', formData.platform) : t('contact.account_placeholder')}
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('contact.message_label')}
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400"
              placeholder={t('contact.message_placeholder')}
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md p-3">
              <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            onClick={(e) => {
              // Prevent any potential double submission
              if (loading) {
                e.preventDefault();
                return;
              }
            }}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('contact.button_sending')}
              </div>
            ) : (
              t('contact.button_send')
            )}
          </button>
        </form>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-3">{t('contact.info_title')}</h3>
        <ul className="text-yellow-700 dark:text-yellow-300 space-y-1 text-sm">
          <li>{t('contact.info_response')}</li>
          <li>{t('contact.info_purchase')}</li>
        </ul>
      </div>
    </div>
  );
}