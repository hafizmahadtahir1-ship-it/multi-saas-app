import React from "react";

interface Template {
  id: string;
  name: string;
  description: string;
}

interface TemplateCardProps {
  template: Template;
  teamId: string;
  isActive?: boolean;
  loading?: string | null;
  onActivated?: (templateId: string) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  teamId,
  isActive = false,
  loading,
  onActivated,
}) => {
  const handleActivate = () => {
    onActivated?.(template.id);
  };

  return (
    <div className="border p-4 rounded shadow mb-4">
      <h2 className="font-bold text-lg">{template.name}</h2>
      <p className="text-gray-600">{template.description}</p>

      <button
        onClick={handleActivate}
        disabled={isActive || loading === template.id}
        className={`mt-2 px-4 py-2 rounded ${
          isActive || loading === template.id
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        {loading === template.id ? "Activating..." : isActive ? "Active" : "Activate"}
      </button>
    </div>
  );
};

export default TemplateCard;