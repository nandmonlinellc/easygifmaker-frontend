import React from 'react';
import { Card, CardContent } from '@/components/ui/card.jsx';

const ProcessingState = ({ 
  title, 
  description,
  useGradient = true 
}) => {
  const cardClassName = useGradient 
    ? "bg-gradient-to-br from-white to-blue-50/30 shadow-lg"
    : "";

  return (
    <Card className={cardClassName}>
      <CardContent className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default ProcessingState; 