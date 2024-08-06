import dayjs from "dayjs";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function getLocalTimezone()
{
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (error) {
        try {
            return dayjs.tz.guess();
        } catch (error) {
            return "America/Chicago";
        }
    }
}

export default dayjs;