import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import packageJSON from '../../../../package.json';

const Footer = () => {
  const [t] = useTranslation();

  return (
    <footer className="main-footer">
      <strong>
        <span>Copyright © {DateTime.now().toFormat('y')} </span>
        <a href="https://theinternationalschoolofministry.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#2a2f54' }}>
        International School of Ministry
        </a>
        <span>.</span>
      </strong>
      
    </footer>
  );
};

export default Footer;
