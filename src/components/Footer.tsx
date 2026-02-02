import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Github, Twitter, Linkedin, Sparkles } from 'lucide-react'
import { useTranslation } from '../store/languageStore'

export default function Footer() {
  const t = useTranslation()

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold italic text-white">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span>Burlart</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t('footerDescription') || 'AI ilə peşəkar video və şəkil yaratma platforması. Güclü AI modelləri ilə kreativ ideyalarınızı həyata keçirin.'}
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 text-gray-400 hover:text-white" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-gray-400 hover:text-white" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-base sm:text-lg">
              {t('quickLinks') || 'Quick Links'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/landing"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t('packages')}
                </Link>
              </li>
              <li>
                <Link
                  to="/create"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t('create')}
                </Link>
              </li>
              <li>
                <Link
                  to="/documents"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t('documents') || 'Documents'}
                </Link>
              </li>
              <li>
                <Link
                  to="/jobs"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t('jobs')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-base sm:text-lg">
              {t('support') || 'Support'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/documents"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t('documentation') || 'Documentation'}
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@burlart.az"
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>support@burlart.az</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+994501234567"
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>+994 50 123 45 67</span>
                </a>
              </li>
            </ul>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-base sm:text-lg">
              {t('about') || 'About'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t('aboutUs') || 'About Us'}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t('ourMission') || 'Our Mission'}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t('team') || 'Team'}
                </Link>
              </li>
              <li>
                <Link
                  to="/documents"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t('careers') || 'Careers'}
                </Link>
              </li>
              <li>
                <a
                  href="https://trivasoft.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t('trivasoft') || 'Trivasoft'}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-base sm:text-lg">
              {t('contact') || 'Contact'}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400">
                  {t('address') || 'Baku, Azerbaijan'}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <a
                  href="mailto:info@burlart.az"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  info@burlart.az
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <a
                  href="tel:+994501234567"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  +994 50 123 45 67
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-400 text-center sm:text-left">
              <p>
                © {new Date().getFullYear()} Burlart. {t('allRightsReserved') || 'All rights reserved.'}
              </p>
              <p className="mt-1">
                {t('developedBy') || 'Developed by'}{' '}
                <a
                  href="https://trivasoft.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  Trivasoft
                </a>
              </p>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500">
              <Link
                to="/documents"
                className="hover:text-gray-300 transition-colors"
              >
                {t('privacyPolicy') || 'Privacy Policy'}
              </Link>
              <Link
                to="/documents"
                className="hover:text-gray-300 transition-colors"
              >
                {t('termsOfService') || 'Terms of Service'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

