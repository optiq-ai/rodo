import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const AnimatedPercentageIndicator = ({ value, label, color, size = 'medium', animated = true }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayValue(value);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, animated]);

  const getSize = () => {
    switch (size) {
      case 'small': return { width: '60px', height: '60px', fontSize: '14px', labelSize: '10px' };
      case 'large': return { width: '120px', height: '120px', fontSize: '24px', labelSize: '14px' };
      default: return { width: '80px', height: '80px', fontSize: '18px', labelSize: '12px' };
    }
  };

  const { width, height, fontSize, labelSize } = getSize();
  
  return (
    <div className="text-center fade-in" style={{ animationDelay: '0.3s' }}>
      <div 
        className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
        style={{ 
          width, 
          height, 
          background: `conic-gradient(${color} ${displayValue}%, #e9ecef ${displayValue}% 100%)`,
          transition: 'background 1s ease-out',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div 
          className="rounded-circle d-flex align-items-center justify-content-center bg-white"
          style={{ 
            width: 'calc(100% - 10px)', 
            height: 'calc(100% - 10px)',
            position: 'absolute'
          }}
        >
          <span style={{ fontSize, fontWeight: 'bold' }}>{displayValue}%</span>
        </div>
      </div>
      {label && <div style={{ fontSize: labelSize }}>{label}</div>}
    </div>
  );
};

const AnimatedProgressBar = ({ value, label, color, height = '10px', animated = true }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayValue(value);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, animated]);

  return (
    <div className="mb-3 fade-in" style={{ animationDelay: '0.4s' }}>
      {label && (
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span>{label}</span>
          <span className={`status-badge status-${color}`}>{displayValue}%</span>
        </div>
      )}
      <div className="progress" style={{ height }}>
        <div 
          className={`progress-bar progress-bar-${color}`}
          role="progressbar" 
          style={{ 
            width: `${displayValue}%`,
            transition: 'width 1s ease-out'
          }}
          aria-valuenow={displayValue} 
          aria-valuemin="0" 
          aria-valuemax="100"
        />
      </div>
    </div>
  );
};

const AnimatedSelect = ({ options, value, onChange, label, placeholder = "Wybierz opcję..." }) => {
  const getOptionClass = (optionValue) => {
    if (optionValue === value) {
      switch (optionValue) {
        case 'TAK':
        case 'POZYTYWNA':
          return 'status-positive';
        case 'NIE':
        case 'NEGATYWNA':
          return 'status-negative';
        case 'ZASTRZEŻENIA':
          return 'status-warning';
        case 'W REALIZACJI':
          return 'status-in-progress';
        default:
          return 'status-not-applicable';
      }
    }
    return '';
  };

  return (
    <Form.Group className="mb-3 fade-in" style={{ animationDelay: '0.2s' }}>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Select
        value={value}
        onChange={onChange}
        className="animated-select"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            className={getOptionClass(option.value)}
          >
            {option.label}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

const AnimatedButton = ({ children, variant = "primary", onClick, className = "", animated = true, ...props }) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      className={`${className} ${animated ? 'btn-animated' : ''}`}
      {...props}
    >
      {children}
    </Button>
  );
};

export { 
  AnimatedPercentageIndicator, 
  AnimatedProgressBar, 
  AnimatedSelect, 
  AnimatedButton 
};
