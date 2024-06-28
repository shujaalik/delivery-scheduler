import { AddIcon } from "@chakra-ui/icons";
import { Button, FormControl, FormLabel, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, VStack, useDisclosure, useToast } from "@chakra-ui/react";
import { DeliveryJob } from "./App";

const AddDelivery = ({
    addDelivery
}: {
    addDelivery: (delivery: DeliveryJob) => void
}) => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        if (!data.get('name') || !data.get('processing-time') || !data.get('profit') || !data.get('deadline') || !data.get('flexibility')) return toast({
            title: "Error",
            description: "Please fill all fields",
            status: "error",
            duration: 3000,
            isClosable: true,
        })
        const payload: DeliveryJob = {
            name: data.get('name') as string,
            processingTime: +data.get('processing-time')!,
            profit: +data.get('profit')!,
            deadline: +data.get('deadline')!,
            processingTimeCompleted: 0,
            flexibility: data.get('flexibility') as "flexible" | "strict",
            profitToTimeRatio: +data.get('profit')! / +data.get('processing-time')!
        }
        try {
            addDelivery(payload);
            onClose();
            form.reset();
            toast({
                title: "Success",
                description: "Delivery has been added",
                status: "success",
                duration: 3000,
                isClosable: true,
            })
        } catch (err) {
            toast({
                title: "Error",
                description: "No vehicles available",
                status: "error",
                duration: 3000,
                isClosable: true,
            })
        }
    }

    return <>
        <Button size="sm" colorScheme="orange" leftIcon={<AddIcon />} onClick={onOpen}>Add Delivery</Button>

        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <form onSubmit={submit}>
                <ModalContent>
                    <ModalHeader>Add Delivery</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack w="100%" gap={5}>
                            <FormControl isRequired>
                                <FormLabel fontSize="sm">Delivery Name</FormLabel>
                                <Input name="name" size="sm" type='text' />
                            </FormControl>
                            <HStack w="100%" gap={5}>
                                <FormControl isRequired>
                                    <FormLabel fontSize="sm">Processing time (sec)</FormLabel>
                                    <Input name="processing-time" size="sm" type='number' />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel fontSize="sm">Profit</FormLabel>
                                    <Input name="profit" size="sm" type='number' />
                                </FormControl>
                            </HStack>
                            <HStack w="100%" gap={5}>
                                <FormControl isRequired>
                                    <FormLabel fontSize="sm">Deadline</FormLabel>
                                    <Input name="deadline" size="sm" type='number' />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel fontSize="sm">Deadline Flexibility</FormLabel>
                                    <Select size="sm" name="flexibility">
                                        <option value="flexible">Flexible</option>
                                        <option value="strict">Strict</option>
                                    </Select>
                                </FormControl>
                            </HStack>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant='outline' colorScheme='red' size="sm" mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button size="sm" colorScheme="orange" type="submit">Confirm</Button>
                    </ModalFooter>
                </ModalContent>
            </form>
        </Modal>
    </>
}

export default AddDelivery