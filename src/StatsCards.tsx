import { Card, Flex, Heading, SimpleGrid, Text, VStack, Icon } from "@chakra-ui/react"
import { IconType } from "react-icons"
import { FaRegClock } from "react-icons/fa"
import { MdOutlineIncompleteCircle } from "react-icons/md"
import { TbTruckDelivery } from "react-icons/tb"
import { MyData } from "./App"

const formatter = new Intl.NumberFormat("en-US");
const StatsCards = ({
    data
}: {
    data: MyData
}) => {
    return <SimpleGrid columns={4} gap={5} w="100%">
        <Stat title="Ongoing Deliveries" value={formatter.format(data.deliveries.ongoing.length)} icon={TbTruckDelivery} />
        <Stat title="Queued Deliveries" value={formatter.format(data.deliveries.queued.length)} icon={FaRegClock} />
        <Stat title="Completed Deliveries" value={formatter.format(data.deliveries.completed.length)} icon={MdOutlineIncompleteCircle} />
        <Stat title="Free Vehicles" value={formatter.format(data.vehicles.free)} icon={TbTruckDelivery} />
    </SimpleGrid>
}

const Stat = ({
    title,
    value,
    icon
}: {
    title: string,
    value: string,
    icon: IconType
}) => {

    return <Card py={5} px={3} boxShadow="md" w="100%">
        <Flex gap={4} alignItems="flex-start" justifyContent="space-between">
            <VStack alignItems="flex-start">
                <Text fontWeight={600} fontFamily="Teko">{title}</Text>
                <Heading fontWeight={700} fontFamily="Teko">{value}</Heading>
            </VStack>
            <Icon fontSize="2xl" as={icon} />
        </Flex>
    </Card>
}

export default StatsCards