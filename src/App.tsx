import { Badge, Box, Card, Flex, GridItem, HStack, Heading, IconButton, Progress, SimpleGrid, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from "@chakra-ui/react"
import StatsCards from "./StatsCards"
import AddDelivery from "./AddDelivery"
import AddVehicle from "./AddVehicle"
import Clock from "./Clock"
import { useEffect, useMemo, useState } from "react"
import { IoPlay, IoStop } from "react-icons/io5"
import { RadialBar } from "@ant-design/plots"

interface DeliveryJob {
  name: string,
  processingTime: number,
  processingTimeCompleted: number,
  profit: number,
  deadline: number,
  flexibility: "flexible" | "strict",
  profitToTimeRatio: number,
}

interface DeliveryJobWithStats extends DeliveryJob {
  status: "queued" | "ongoing" | "completed",
  progress: number,
}

interface MyData {
  vehicles: {
    free: number,
  },
  deliveries: {
    queued: DeliveryJob[],
    ongoing: DeliveryJob[],
    completed: DeliveryJob[],
  }
}

const preLoad: MyData = {
  vehicles: {
    free: 0,
  },
  deliveries: {
    queued: [],
    ongoing: [],
    completed: []
  }
};

function App() {
  const [data, setData] = useState<MyData>(preLoad);
  const [refresh, setRefresh] = useState(false);
  const [start, setStart] = useState(false);

  const deliveries: DeliveryJobWithStats[] = useMemo(() => {
    // first process ongoing deliveries, then queued deliveries, then completed deliveries
    const ongoing: DeliveryJobWithStats[] = data.deliveries.ongoing.map(delivery => ({ ...delivery, status: "ongoing", progress: delivery.processingTimeCompleted / delivery.processingTime }));
    const queued: DeliveryJobWithStats[] = data.deliveries.queued.map(delivery => ({ ...delivery, status: "queued", progress: 0 }));
    const completed: DeliveryJobWithStats[] = data.deliveries.completed.map(delivery => ({ ...delivery, status: "completed", progress: 1 }));
    return [...ongoing, ...queued, ...completed];
    // eslint-disable-next-line
  }, [refresh]);

  const graphData = useMemo(() => {
    const queued = data.deliveries.queued.length;
    const ongoing = data.deliveries.ongoing.length;
    const completed = data.deliveries.completed.length;
    return [
      { name: 'Queued', stat: queued },
      { name: 'Ongoing', stat: ongoing },
      { name: 'Completed', stat: completed },
      { name: 'Total', stat: queued + ongoing + completed },
    ];
    // eslint-disable-next-line
  }, [refresh]);

  const tick = () => {
    setRefresh(prev => !prev);
  }

  useEffect(() => {
    if (!start) return;
    // all ongoing deliveries, add 0.1 from processingTimeCompleted and if processingTimeCompleted >= processingTime, move to completed
    setData(prev => {
      if (prev.vehicles.free !== 0 && prev.deliveries.queued.length !== 0) {
        const delivery = prev.deliveries.queued[0];
        prev.deliveries.ongoing.push(delivery);
        prev.vehicles.free--;
        prev.deliveries.queued = prev.deliveries.queued.slice(1);
      }
      const newList = prev.deliveries.ongoing.filter(delivery => {
        delivery.processingTimeCompleted += 0.5;
        if (delivery.processingTimeCompleted >= delivery.processingTime) {
          prev.deliveries.completed.push(delivery);
          prev.vehicles.free++;
          return false;
        }
        return true;
      });
      prev.deliveries.ongoing = newList;
      // const payload = JSON.stringify(prev);
      // localStorage
      // localStorage.setItem("data", payload);
      return prev;
    });
  }, [refresh, start]);

  useEffect(() => {
    const payload = localStorage.getItem("data");
    setData(payload ? JSON.parse(payload) : preLoad);
  }, [])

  const addVehicle = () => {
    setData(prev => {
      prev.vehicles.free++;
      const payload = JSON.stringify(prev);
      localStorage.setItem("data", payload);
      return JSON.parse(payload);
    })
  }

  const sortDeliveries = (deliveries: DeliveryJob[]): DeliveryJob[] => {
    // sorting using bubble sort
    // 1. Sort by deadline(unix) if strict else sort by profitToTimeRatio
    let swapped: boolean;
    let n = deliveries.length;
    do {
      swapped = false;
      for (let i = 1; i < n; i++) {
        // Determine the sorting criteria based on `strict`
        const strict = deliveries[i - 1].flexibility === "strict";
        const shouldSwap = strict ? deliveries[i - 1].deadline > deliveries[i].deadline : deliveries[i - 1].profitToTimeRatio < deliveries[i].profitToTimeRatio;

        if (shouldSwap) {
          // Swap the elements
          const temp = deliveries[i - 1];
          deliveries[i - 1] = deliveries[i];
          deliveries[i] = temp;
          swapped = true;
        }
      }
      // Reduce n by 1 since the last element is already in its correct place
      n--;
    } while (swapped);
    return deliveries;
  }

  const addDelivery = (delivery: DeliveryJob) => {
    setData(prev => {
      const newList = prev.deliveries.queued;
      newList.push(delivery);
      prev.deliveries.queued = sortDeliveries(newList);
      const payload = JSON.stringify(prev);
      localStorage.setItem("data", payload);
      return JSON.parse(payload);
    });
  }

  const config = {
    data: graphData,
    xField: 'name',
    yField: 'stat',
    maxAngle: 300,
    radius: 1,
    innerRadius: 0.4,
    tooltip: {
      items: ['stat'],
    },
    legend: true,
    axis: {
      y: false,
    },
    style: {
      radius: 180,
      fill: ({ name }: { name: string }) => {
        if (name === "Total") {
          return "#5B8FF9"
        } else if (name === "Queued") {
          return "red"
        }
        else if (name === "Ongoing") {
          return "#F6BD16"
        }
        else {
          return "#5AD8A6"
        }
      },
    },
  }

  return (
    <Box p={8} >
      <VStack w="100%" gap={7}>
        <Flex w="100%" alignItems={"center"} justifyContent={"space-between"}>
          <Box>
            <Clock tick={tick} />
            <Heading fontWeight={700} textTransform={"uppercase"} fontFamily="Teko">dashboard</Heading>
            <Text fontSize="xs" opacity={0.8} fontWeight={500}>See all your shipment overview here.</Text>
          </Box>
          <HStack alignItems={"center"} justifyContent="center" gap={5}>
            <IconButton
              aria-label="start-stop"
              icon={start ? <IoStop /> : <IoPlay />}
              size="sm" colorScheme={
                start ? "red" : "green"
              } onClick={() => setStart(prev => !prev)} />
            <AddDelivery addDelivery={addDelivery} />
            <AddVehicle addVehicle={addVehicle} />
          </HStack>
        </Flex>
        <StatsCards data={data} />
        <SimpleGrid columns={3} gap={5} w="100%">
          <Card py={6} px={4} boxShadow={"md"}>
            <RadialBar height={350} {...config} />
          </Card>
          <GridItem colSpan={2}>
            <Card boxShadow={"md"} h="100%">
              <Table>
                <Thead>
                  <Tr>
                    <Th>Delivery</Th>
                    <Th>Profit</Th>
                    <Th>Profit To Time</Th>
                    <Th>Status</Th>
                    <Th>Deadline</Th>
                    <Th>Deadline Flexibility</Th>
                    <Th>Remaining Time</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {deliveries.map((delivery, index) => (
                    <Tr key={index}>
                      <Td>{delivery.name}</Td>
                      <Td>{delivery.profit}</Td>
                      <Td>{delivery.profitToTimeRatio}</Td>
                      <Td>
                        <Badge textTransform={"uppercase"} size="sm" colorScheme={
                          delivery.status === "queued" ? "red" :
                            delivery.status === "ongoing" ? "green" : "orange"
                        }>
                          {delivery.status}
                        </Badge>
                      </Td>
                      <Td>{delivery.deadline}</Td>
                      <Td>{delivery.flexibility}</Td>
                      <Td>
                        <Progress colorScheme={
                          delivery.progress >= 0.9 ? "green" :
                            delivery.progress >= 0.5 ? "yellow" : "red"
                        } value={delivery.progress * 100} size="sm" />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Card>
          </GridItem>
        </SimpleGrid>
      </VStack>
    </Box >
  )
}

export default App
export type { MyData, DeliveryJob };