import { Heading } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const Clock = ({
    tick
}: {
    tick: () => void
}) => {
    const [time, setTime] = useState(dayjs().format("HH:mm:ss"));

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(dayjs().format("HH:mm:ss"));
            tick();
        }, 500);

        return () => {
            clearInterval(interval);
        }
        // eslint-disable-next-line
    }, []);

    return <Heading size="md" fontWeight={500} fontFamily="Teko">
        {time}
    </Heading>
}

export default Clock