import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tooltip,
  Select,
  SelectItem,
  Divider,
  useDisclosure,
} from "@nextui-org/react";
import { useModalStore } from "../../../../store/modal";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Input } from "components/ui/Input";
import { Label } from "components/ui/Label";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useDireccionStore } from "../../../../store/direcciones/direcciones";
import { useMunicipioStore } from "../../../../store/direcciones/municipios";
import {
  deleteDireccion,
  updateDireccion,
} from "helpers/api/direccion/direcciones";
import { getUsuarioById } from "../../../../utils/getUsuarioById";
import { ModalProps, DireccionData } from "types/index";

export const ModalEditarDireccion = ({
  idDireccion,
  updateTable,
}: ModalProps) => {
  const isOpen = useModalStore((state) => state.isOpen);
  const onOpen = useModalStore((state) => state.onOpen);
  const onOpenChange = useModalStore((state) => state.onOpenChange);
  const direcciones = useDireccionStore((state) => state.data);
  const municipios = useMunicipioStore((state) => state.data);
  const getMunicipios = useMunicipioStore((state) => state.execute);

  const { setValue, register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    getMunicipios();
  }, [getMunicipios]);

  const handleEdit = () => {
    navigate(`/direcciones/tabla/editar/${idDireccion}`);
  };

  const { id } = params;

  const direccionID: DireccionData = getUsuarioById(id, direcciones)[0];

  useEffect(() => {
    setValue("nombre", direccionID.nombre);
    setValue("municipio", direccionID.municipio);
  }, [direccionID.nombre, direccionID.municipio]);

  const handleClose = () => {
    navigate("/direcciones/tabla");
  };

  const actualizar = async (data: DireccionData) => {
    await updateDireccion(direccionID.id, data);
    updateTable();
  };

  const onSubmit = (data: DireccionData) => {
    actualizar(data);
    navigate("/direcciones/tabla");
  };

  return (
    <>
      <button onClick={handleEdit}>
        <Tooltip content="Editar" color="primary">
          <span className="cursor-pointer text-lg text-azulFuerte active:opacity-50">
            <Icon
              icon="mdi:account-box-edit-outline"
              width={25}
              onClick={onOpen}
            />
          </span>
        </Tooltip>
      </button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        classNames={{ backdrop: "bg-black/10 blur-[1px]" }}
        size="2xl"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 flex flex-col gap-8"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-azulFuerte">
                  Editar Dirección
                </ModalHeader>
                <Divider />
                <ModalBody>
                  <div className="flex flex-col gap-8">
                    <div className="flex gap-8">
                      <div className="flex flex-col gap-1">
                        <Label id="nombre">Nombre</Label>
                        <Input
                          placeholder="Editar nombre"
                          {...register("nombre")}
                        >
                          <Icon
                            icon="mdi:account"
                            width={20}
                            className="text-azulFuerte"
                          />
                        </Input>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label id="municipio_id">Municipio</Label>
                      <Select
                        items={municipios}
                        placeholder="Seleccione un municipio"
                        defaultSelectedKeys={[direccionID.municipioID]}
                        size="lg"
                        {...register("municipio_id")}
                      >
                        {(municipio) => (
                          <SelectItem key={municipio.id}>
                            {municipio.nombre}
                          </SelectItem>
                        )}
                      </Select>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={onClose}
                    onClick={handleClose}
                  >
                    Cerrar
                  </Button>
                  <Button color="primary" type="submit" onPress={onClose}>
                    Editar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export const ModalEliminarDireccion = ({
  idDireccion,
  updateTable,
}: ModalProps) => {
  const direcciones = useDireccionStore((state) => state.data);
  const handleDelete = async () => {
    await deleteDireccion(idDireccion);
    updateTable();
  };
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const direccionID: DireccionData = getUsuarioById(
    idDireccion,
    direcciones,
  )[0];

  return (
    <>
      <button>
        <Tooltip content="Eliminar" color="danger">
          <span className="cursor-pointer text-lg text-azulFuerte active:opacity-50">
            <Icon
              icon="mdi:delete"
              width={25}
              className="text-red-600"
              onClick={onOpen}
            />
          </span>
        </Tooltip>
      </button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Eliminar Dirección
              </ModalHeader>
              <ModalBody>
                <div className="flex w-full flex-col items-center gap-2 py-4">
                  <h2 className="text-xl font-medium">
                    ¿Desea eliminar la dirección:
                  </h2>
                  <h3 className="text-2xl font-bold text-red-600">
                    {direccionID.nombre}, {direccionID.municipio} ?
                  </h3>
                </div>
                <div className="flex gap-3">
                  <Button
                    color="danger"
                    variant="light"
                    onPress={onClose}
                    className="flex-grow"
                  >
                    Cerrar
                  </Button>
                  <Button
                    color="primary"
                    onPress={onClose}
                    onClick={handleDelete}
                    className="flex-grow"
                  >
                    Eliminar
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};