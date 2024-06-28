import { AddIcon } from "@chakra-ui/icons";
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useDisclosure, useToast } from "@chakra-ui/react";
import { useRef } from "react";

const AddVehicle = ({
    addVehicle
}: {
    addVehicle: () => void
}) => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef(null);

    const add = () => {
        addVehicle();
        console.log("fire")
        onClose();
        toast({
            title: "Success",
            description: "Vehicle has been added",
            duration: 3000,
            status: "success"
        })
    }

    return <>
        <Button variant="outline" size="sm" colorScheme="orange" leftIcon={<AddIcon />} onClick={onOpen}>Add Vehicle</Button>
        <AlertDialog
            leastDestructiveRef={cancelRef}
            isOpen={isOpen}
            onClose={onClose}>
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Add Vehicle
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        Are you sure? You can't undo this action afterwards.
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button size="sm" ref={cancelRef} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button size="sm" colorScheme='orange' onClick={add} ml={3}>
                            Add
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    </>
}

export default AddVehicle