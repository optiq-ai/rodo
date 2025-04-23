import React from 'react';
import { Alert } from 'react-bootstrap';

/**
 * Komponent do wyświetlania komunikatów o błędach API
 * @param {Object} props - Właściwości komponentu
 * @param {string} props.error - Komunikat błędu
 * @param {boolean} props.show - Czy komunikat ma być widoczny
 * @param {function} props.onClose - Funkcja wywoływana po zamknięciu komunikatu
 * @param {string} props.variant - Wariant alertu (danger, warning, info, success)
 * @returns {JSX.Element|null} - Komponent alertu lub null jeśli nie ma błędu
 */
const ApiErrorAlert = ({ error, show = true, onClose, variant = 'danger' }) => {
  if (!error || !show) return null;
  
  return (
    <Alert 
      variant={variant} 
      dismissible={!!onClose}
      onClose={onClose}
      className="mt-3 mb-3"
    >
      {error}
    </Alert>
  );
};

export default ApiErrorAlert;
