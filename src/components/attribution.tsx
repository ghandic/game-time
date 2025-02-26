import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

function Attribution({
  authors = [],
  description = '',
  link = '',
}: {
  authors?: string[];
  description?: string;
  link?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Info />
      </TooltipTrigger>
      <TooltipContent>
        <h2 className="text-md font-bold">About</h2>
        <p>{description}</p>
        <h2 className="text-md font-bold pt-2">Creators</h2>
        <p>
          This game was built by Andy Challis and designed by{' '}
          <a href={link} className="text-blue-400" target="_blank">
            {authors.join(', ')}.
          </a>
        </p>
      </TooltipContent>
    </Tooltip>
  );
}

export default Attribution;
