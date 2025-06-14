import React from 'react';

interface BadgeProps {
  stateId?: number;
  customText?: string;
  customColor?: string;
  customClassName?: string;
}

const Badge: React.FC<BadgeProps> = ({ stateId = 0,  customColor = "bg-gray-300", customText = "Desconocido", customClassName = ""}) => { 
  let color = '';
  let text = '';

  switch (stateId) {
    case 1:
      color = 'bg-yellow-300';
      text = 'Recibido';
      break;
    case 2:
      color = 'bg-blue-500';
      text = 'Leído';
      break;
    case 3:
      color = 'bg-bramotors-red';
      text = 'Atendido';
      break;
    case 4:
    color = 'bg-red-500';
    text = 'Vencido';
    break;
    default:
      color = customColor;
      text = customText;
  }

  return (
    <span className={`uppercase inline-flex items-center px-2 py-1 text-xs font-bold text-white rounded ${color} ${customClassName}`}>
      {text}
    </span>
  );
};

export default Badge;
