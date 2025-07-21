import { Linkedin, Instagram } from 'lucide-react';
import React from 'react';

interface SocialIconsProps {
  xUrl?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  className?: string;
}

// Classic Twitter bird logo SVG
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 20}
    height={props.height || 20}
    {...props}
  >
    <path d="M22.46 5.924c-.793.352-1.645.59-2.54.697a4.48 4.48 0 0 0 1.965-2.475 8.94 8.94 0 0 1-2.828 1.082A4.48 4.48 0 0 0 16.11 4c-2.485 0-4.5 2.014-4.5 4.5 0 .353.04.697.116 1.025C7.728 9.37 4.1 7.555 1.67 4.905c-.388.666-.61 1.44-.61 2.263 0 1.563.796 2.942 2.008 3.75a4.48 4.48 0 0 1-2.037-.563v.057c0 2.183 1.553 4.004 3.617 4.42-.378.104-.777.16-1.188.16-.29 0-.57-.028-.844-.08.57 1.78 2.223 3.078 4.183 3.113A8.98 8.98 0 0 1 2 19.54a12.68 12.68 0 0 0 6.88 2.017c8.253 0 12.77-6.835 12.77-12.77 0-.195-.004-.39-.013-.583A9.22 9.22 0 0 0 24 4.59a8.94 8.94 0 0 1-2.54.697z" />
  </svg>
);

export const SocialIcons: React.FC<SocialIconsProps> = ({ xUrl, instagramUrl, linkedinUrl, className }) => {
  return (
    <div className={`flex items-center space-x-3 ${className || ''}`}>
      {xUrl && (
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="View on Twitter"
          className="text-blue-400 hover:text-blue-600"
        >
          <XIcon className="h-5 w-5" />
        </a>
      )}
      {instagramUrl && (
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="View on Instagram"
          className="text-pink-600 hover:text-pink-800"
        >
          <Instagram className="h-5 w-5" />
        </a>
      )}
      {linkedinUrl && (
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="View on LinkedIn"
          className="text-blue-600 hover:text-blue-800"
        >
          <Linkedin className="h-5 w-5" />
        </a>
      )}
    </div>
  );
}; 