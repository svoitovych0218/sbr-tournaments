export const formatTimeSpan =(timeSpan: string) => {
    let pattern = /(\d+)\.(\d{2}):(\d{2}):(\d{2})(\.\d+)?/;
    let match = timeSpan.match(pattern);

    let days = 0, hours = 0, minutes = 0;

    if (match) {
        // TimeSpan includes days
        [, days, hours, minutes, ] = match.map(Number);
    } else {
        // Attempt to parse the TimeSpan assuming it does not include days
        pattern = /(\d{1,2}):(\d{2}):(\d{2})(\.\d+)?/;
        match = timeSpan.match(pattern);
        if (match) {
            // TimeSpan does not include days
            [, hours, minutes, ] = match.map(Number);
        } else {
            return "Invalid TimeSpan format";
        }
    }

    // Building the formatted string
    const parts: string[] = [];
    if (days) parts.push(`${days} day${days > 1 ? 's' : ''}`);
    if (hours) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
    if (minutes) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
    // if (seconds) parts.push(`${seconds} second${seconds > 1 ? 's' : ''}`);

    return parts.length ? parts.join(', ') : '0 seconds';
}