import * as Icons from 'lucide-react';

interface IconProps extends Omit<Icons.LucideProps, 'ref'> {
  name: string;
}

const Icon = ({ name, ...props }: IconProps) => {
  // Type assertion to access the icon from the Icons object
  const LucideIcon = (Icons as unknown as Record<string, React.ComponentType<Icons.LucideProps>>)[name];

  if (!LucideIcon) {
    // Return a default question mark icon if the requested icon is not found
    return <Icons.HelpCircle {...props} />;
  }

  return <LucideIcon {...props} />;
};

export default Icon; 