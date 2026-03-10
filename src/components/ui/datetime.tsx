import React from 'react';

interface DateTimeProps {
  dateString: string | undefined | null;
  className?: string;
}

const FormattedDateTime: React.FC<DateTimeProps> = ({ dateString, className }) => {
  if (!dateString) return null;

  try {
    const date = new Date(dateString);

    const formatted = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);

    return (
      <p className={className || "text-xs text-muted-foreground"}>
        {formatted}
      </p>
    );
  } catch (error) {
    console.error("Invalid date passed to FormattedDateTime:", dateString);
    return null;
  }
};

export default FormattedDateTime;