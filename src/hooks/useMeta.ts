import React from "react";

const useMeta = ({title, description="", keywords="", authors=[], ...rest}: {title:string, 
    description?:string, keywords?:string, authors?:string[], link?:string
}) => {
    const documentDefined = typeof document !== 'undefined';
    const originalTitle = React.useRef(documentDefined ? document.title : null);
    const originalDescription = React.useRef(documentDefined ? document.querySelector('meta[name="description"]')?.getAttribute('content') : null);
    const originalKeywords = React.useRef(documentDefined ? document.querySelector('meta[name="keywords"]')?.getAttribute('content') : null);
    const originalAuthor = React.useRef(documentDefined ? document.querySelector('meta[name="author"]')?.getAttribute('content') : null);

    
    React.useEffect(() => {
      if (!documentDefined) return;
  
      const originalTitleValue = originalTitle.current;
      if (document.title !== title) document.title = title;

      const originalDescriptionValue = originalDescription.current;
        if (description && document.querySelector('meta[name="description"]')) {
            document.querySelector('meta[name="description"]')!.setAttribute('content', description);
            } else if (originalDescriptionValue) {
            document.querySelector('meta[name="description"]')!.setAttribute('content', originalDescriptionValue);
        }
        if (keywords && document.querySelector('meta[name="keywords"]')) {
            document.querySelector('meta[name="keywords"]')!.setAttribute('content', keywords);
            } else if (originalKeywords.current) {
            document.querySelector('meta[name="keywords"]')!.setAttribute('content', originalKeywords.current);
        }
        if (authors && document.querySelector('meta[name="author"]')) {
            document.querySelector('meta[name="author"]')!.setAttribute('content', `Game built by Andy Challis, designed by ${authors.join(", ")}`);
            } else if (originalAuthor.current) {
            document.querySelector('meta[name="author"]')!.setAttribute('content', originalAuthor.current);
        }
  
      return () => {
        document.title = originalTitleValue ?? "";
      };
    }, [title, documentDefined, description, keywords, authors]);

    return {title, description, keywords, authors, ...rest}
  };

  export default useMeta;