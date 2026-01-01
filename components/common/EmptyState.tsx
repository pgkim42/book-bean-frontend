interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-md">
      {icon && <div className="mb-4">{icon}</div>}
      <h2 className="text-2xl font-bold text-gray-700 mb-2">{title}</h2>
      {description && <p className="text-gray-500 mb-6">{description}</p>}
      {action && (
        <button onClick={action.onClick} className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          {action.label}
        </button>
      )}
    </div>
  );
}
