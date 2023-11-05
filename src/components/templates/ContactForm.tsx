/* eslint-disable indent */
import { useLazyQuery, useMutation } from "@apollo/client"
import { useContact } from "../../providers/ContactProvider"
import { Contact } from "../../services/types/contact"
import { ADD_CONTACT_WITH_PHONES, ADD_PHONE, DELETE_CONTACT, DELETE_PHONE, EDIT_CONTACT, EDIT_PHONE } from "../../services/mutation/contact"
import { GET_CONTACT_DETAIL, GET_CONTACT_LIST } from "../../services/queries/contact"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { deepCopy } from "../../utils/object-helper"
import { parseAndSetFormValue, validateField } from "../../utils/form-helper"
import MainContent from "../atoms/MainContent"
import Container from "../atoms/Container"
import FormControl from "../molecules/FormControl"
import { Flex, FlexJustifyBetween } from "../atoms/Flex"
import { css } from "@emotion/css"
import Text from "../atoms/Text"
import Button from "../atoms/Button"
import ButtonIcon from "../atoms/ButtonIcon"
import TextMuted from "../atoms/SubText"
import TrashIcon from "../../icons/TrashIcon"
import PencilIcon from "../../icons/PencilIcon"
import CheckIcon from "../../icons/CheckIcon"
import CloseIcon from "../../icons/CloseIcon"
import ModalDelete from "../organism/ModalDelete"
import Avatar from "../atoms/Avatar"
import { useNotification } from "../../providers/NotificationProvider"

interface Form {
  first_name: string
  last_name: string
  phones: {
    number: string
  }[]
}

const initialForm: Form = {
  first_name: "",
  last_name: "",
  phones: []
}

const rules: {
  [key: string]: {
    required: boolean
    minLength: number
    maxLength: number
    alphanumeric: boolean
  }

} = {
  first_name: {
    required: true,
    alphanumeric: true,
    minLength: 1,
    maxLength: 50
  },
  last_name: {
    required: false,
    alphanumeric: true,
    minLength: 0,
    maxLength: 50
  },
  phones: {
    required: true,
    minLength: 8,
    maxLength: 20,
    alphanumeric: true
  }
}

const ContactForm = () => {
  const navigate = useNavigate()
  const { addNotification } = useNotification()
  const { getContact, updateContact, deleteContact: deleteContactLocal, addContact } = useContact()

  // Get id from url
  const [searchParams] = useSearchParams()
  const id = Number(searchParams.get("id") || 0)

  // Queries and Mutations
  const [getContacts] = useLazyQuery(GET_CONTACT_LIST, { fetchPolicy: "no-cache" })
  const [addContactWithPhones, { loading: loadingAdd }] = useMutation(ADD_CONTACT_WITH_PHONES)
  const [getContactDetail] = useLazyQuery(GET_CONTACT_DETAIL, { fetchPolicy: "no-cache" })
  const [editContact] = useMutation(EDIT_CONTACT)
  const [deleteContact] = useMutation(DELETE_CONTACT)
  const [addPhone] = useMutation(ADD_PHONE)
  const [deletePhone] = useMutation(DELETE_PHONE)
  const [editPhone] = useMutation(EDIT_PHONE)

  // States
  const [form, setForm] = useState<Form>(deepCopy(initialForm))
  const [errors, setErrors] = useState<any>(deepCopy(initialForm))
  const [editMode, setEditMode] = useState<any>()
  const [deleteProps, setDeleteProps] = useState<{ isOpen?: boolean; message?: string; onConfirm?: () => void }>()
  const [detailContact, setDetailContact] = useState<{ contact: Contact, source: "local" | "db" } | null>(null)

  // Fetch detail on mount if id is present
  useEffect(() => {
    if (id) {
      fetchDetail()
    }
  }, [id])

  useEffect(() => {
    if (detailContact?.source === "local") {
      fetchDetail("local")
    }
  }, [getContact])

  // Toggle edit mode
  const toggleEditMode = (type: string, status: boolean) => {
    setEditMode({ ...editMode, [type]: status })
  }

  // Handle cancel edit
  const handleCancelEdit = (type: string, index: number = 0) => {
    const newForm = deepCopy(form)
    if (type.includes("phone")) {
      if (detailContact?.contact?.phones[index]) {
        newForm.phones[index].number = detailContact?.contact?.phones[index].number
      } else {
        newForm.phones.splice(index, 1)
      }
    }

    if (type === "contact") {
      const { first_name, last_name } = detailContact?.contact || { first_name: "", last_name: "" }
      newForm.first_name = first_name
      newForm.last_name = last_name
    }

    setForm(newForm)
    toggleEditMode(type, false)

    const newErrors = deepCopy(errors)
    if (type.includes("phone")) {
      newErrors.phones[index].number = ""
    }
    if (type === "contact") {
      newErrors.first_name = ""
      newErrors.last_name = ""
    }

    setErrors(newErrors)
  }

  const getContactDetailLocal = () => {
    const contact = getContact(id)
    // console.log(contact, "REGET CONTACT")
    if (contact) {
      const { first_name, last_name, phones } = contact
      setDetailContact({ contact, source: "local" })
      setForm({
        first_name,
        last_name,
        phones: phones.map((phone) => ({ number: phone.number }))
      })
      setErrors({
        first_name: "",
        last_name: "",
        phones: phones.map(() => ({ number: "" }))
      })
    } else {
      addNotification({
        message: "Contact not found",
        type: "error"
      })
    }
  }

  // Fetch contact detail
  const fetchDetail = (type: "local" | "db" = "db") => {
    if (type === "db") {
      getContactDetail({
        variables: { id: Number(id) }
      }).then((data) => {
        const contact = data.data?.contact
        if (contact) {
          const { first_name, last_name, phones } = contact
          setDetailContact({ contact, source: "db" })
          setForm({
            first_name,
            last_name,
            phones: phones.map((phone) => ({ number: phone.number }))
          })
          setErrors({
            first_name: "",
            last_name: "",
            phones: phones.map(() => ({ number: "" }))
          })
        } else { // from local
          getContactDetailLocal()
        }
      }).catch(() => {
        addNotification({
          message: "Contact not found",
          type: "error"
        })
      })
    } else {
      getContactDetailLocal()
    }
  }

  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const updatedForm = parseAndSetFormValue(name, value, { ...form });
    setForm(updatedForm);

    const updatedErrors = parseAndSetFormValue(name, "", { ...errors });
    setErrors(updatedErrors);
  }

  // Handle submit all (add contact with phones)
  const handleSubmitAll = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const hasError = validateForm()
    if (hasError) {
      addNotification({
        message: "Please fill all required fields",
        type: "error"
      })
      return
    }

    const ifExist = await isContactExist()
    if (ifExist) {
      addNotification({
        message: "Contact already exist",
        type: "error"
      })
      return
    }

    addContactWithPhones({
      variables: form
    }).then((data) => {
      navigate(`/form?id=${data.data?.insert_contact?.returning[0].id}`)
      addContact({
        ...data.data?.insert_contact?.returning[0],
        favorite: false
      })
      addNotification({
        message: "Contact added successfully",
        type: "success"
      })
    }).catch(() => {
      addNotification({
        message: "Error adding contact",
        type: "error"
      })
    })
  }

  const isContactExist = async () => {
    try {
      const { first_name, last_name } = form

      const { data } = await getContacts({
        variables: {
          where: {
            "_or": [
              { first_name: { _iregex: `(${first_name.split(" ").join("|")}|${first_name})` }, },
              { last_name: { _iregex: `(${last_name.split(" ").join("|")}|${last_name})` } }
            ]
          }
        }
      })

      const currentFullName = `${first_name} ${last_name}`.toLocaleLowerCase().trim()
      const isExist = data?.contacts?.some((contact: Contact) => {
        const fullName = `${contact.first_name} ${contact.last_name}`.toLocaleLowerCase().trim()
        if (fullName === currentFullName && id !== contact.id) {
          return true
        }
      })

      return !!isExist
    } catch (error) {
      return false
    }
  }

  // Handle add phone
  const handleAddPhone = () => {
    const newForm = deepCopy(form)
    newForm.phones.push({ number: "" })
    setForm(newForm)

    const newErrors = deepCopy(errors)
    newErrors.phones.push({ number: "" })
    setErrors(newErrors)

    if (id) {
      toggleEditMode(`phone-${newForm.phones.length - 1}`, true)
    }
  }

  // Handle delete phone
  const handleSubmitDeletePhone = (index: number) => {
    if (!id) {
      const newForm = deepCopy(form)
      newForm.phones.splice(index, 1)
      setForm(newForm)

      const newErrors = deepCopy(errors)
      newErrors.phones.splice(index, 1)
      setErrors(newErrors)
    } else if (detailContact?.source === "local") {
      const newForm = deepCopy(form)
      newForm.phones.splice(index, 1)
      updateContact({
        ...newForm,
        id: Number(id),
      })
      toggleEditMode(`phone-${index}`, false)
      // fetchDetail()
      setDeleteProps({ isOpen: false })
      addNotification({
        message: "Phone number deleted successfully",
        type: "success"
      })
    } else {
      deletePhone({
        variables: {
          contact_id: Number(id),
          number: form.phones[index].number
        }
      }).then(() => {
        fetchDetail()
        toggleEditMode(`phone-${index}`, false)
        setDeleteProps({ isOpen: false })
        addNotification({
          message: "Phone number deleted successfully",
          type: "success"
        })
      }).catch(() => {
        addNotification({
          message: "Error deleting phone number",
          type: "error"
        })
      })
    }
  }

  // Handle submit add/edit phone
  const handleSubmitPhone = (index: number) => {
    const invalidPhone = validateField("phones", form.phones[index].number, rules.phones)
    if (invalidPhone) {
      const newErrors = deepCopy(errors)
      newErrors.phones[index].number = invalidPhone
      setErrors(newErrors)
      addNotification({
        message: "Invalid phone number",
        type: "error"
      })
      return
    }
    if (detailContact?.contact?.phones[index]) { // Edit
      if (detailContact?.source === "local") {
        const newForm = deepCopy(form)
        updateContact({
          ...newForm,
          id: Number(id),
        })
        toggleEditMode(`phone-${index}`, false)
        addNotification({
          message: "Phone number edited successfully",
          type: "success"
        })
      } else {
        editPhone({
          variables: {
            pk_columns: {
              contact_id: Number(id),
              number: detailContact?.contact?.phones[index].number
            },
            new_phone_number: form.phones[index].number
          }
        }).then(() => {
          fetchDetail()
          toggleEditMode(`phone-${index}`, false)
          addNotification({
            message: "Phone number edited successfully",
            type: "success"
          })
        }).catch(() => {
          addNotification({
            message: "Error editing phone number",
            type: "error"
          })
        })
      }
    } else {
      if (detailContact?.source === "local") {
        const newForm = deepCopy(form)
        updateContact({
          ...newForm,
          id: Number(id),
        })
        toggleEditMode(`phone-${index}`, false)
        addNotification({
          message: "Phone number edited successfully",
          type: "success"
        })
      } else {
        addPhone({
          variables: {
            contact_id: Number(id),
            phone_number: form.phones[index].number
          }
        }).then(() => {
          fetchDetail()
          toggleEditMode(`phone-${index}`, false)
          addNotification({
            message: "Phone number added successfully",
            type: "success"
          })
        }).catch(() => {
          addNotification({
            message: "Error adding phone number",
            type: "error"
          })
        })
      }
    }
  }

  // Handle submit edit contact (first name, last name)
  const handleSubmitEditContact = async () => {
    const invalidFirstName = validateField("first_name", form.first_name, rules.first_name)
    const invalidLastName = validateField("last_name", form.last_name, rules.last_name)

    if (invalidFirstName || invalidLastName) {
      setErrors({
        ...errors,
        first_name: invalidFirstName,
        last_name: invalidLastName
      })
      addNotification({
        message: "Invalid form data",
        type: "error"
      })
      return
    }

    const ifExist = await isContactExist()
    if (ifExist) {
      addNotification({
        message: "Contact already exist",
        type: "error"
      })
      return
    }

    if (detailContact?.source === "local") {
      updateContact({
        first_name: form.first_name,
        last_name: form.last_name,
        id: Number(id),
        phones: detailContact?.contact?.phones
      })
      toggleEditMode("contact", false)
      addNotification({
        message: "Contact edited successfully",
        type: "success"
      })
    } else {
      editContact({
        variables: {
          id: Number(id),
          _set: {
            first_name: form.first_name,
            last_name: form.last_name
          }
        }
      }).then(() => {
        fetchDetail()
        toggleEditMode("contact", false)
        addNotification({
          message: "Contact edited successfully",
          type: "success"
        })
      }).catch(() => {
        addNotification({
          message: "Error editing contact",
          type: "error"
        })
      })
    }
  }

  // Handle submit delete contact (Whole contact)
  const handleSubmitDeleteContact = () => {
    if (detailContact?.source === "local") {
      deleteContactLocal(id)
      navigate("/")
      addNotification({
        message: "Contact deleted successfully",
        type: "success"
      })
    } else {
      deleteContact({
        variables: {
          id: Number(id)
        }
      }).then(() => {
        navigate("/")
      }).catch(() => {
        addNotification({
          message: "Error deleting contact",
          type: "error"
        })
      })
    }
  }

  // Handle submit delete (Show modal confirmation)
  const handleSubmitDelete = (type: string, index: number = 0) => {
    if (type === "contact") {
      setDeleteProps({
        isOpen: true,
        message: "Are you sure you want to delete this contact?",
        onConfirm: () => {
          handleSubmitDeleteContact()
        }
      })
    }

    if (type.includes("phone")) {
      setDeleteProps({
        isOpen: true,
        message: "Are you sure you want to delete this phone number?",
        onConfirm: () => {
          handleSubmitDeletePhone(index)
        }
      })
    }
  }

  const validateForm = () => {
    const newErrors = deepCopy(errors)
    let hasError = false
    Object.keys(form).forEach((key) => {
      if (key === "phones") {
        form[key].forEach((phone, index) => {
          const error = validateField(key, phone.number, rules[key as keyof Form] || {})
          if (error) hasError = true
          newErrors[key as keyof Form][index].number = error
        })
      } else {
        const error = validateField(key, form[key as keyof Form], rules[key as keyof Form] || {})
        if (error) hasError = true
        newErrors[key as keyof Form] = error
      }
    })
    setErrors(newErrors)
    return hasError
  }

  const initialAvatar = `${detailContact?.contact?.first_name[0] || ""}${detailContact?.contact?.last_name[0] || ""}`.toUpperCase()

  return (
    <>
      <MainContent>
        {id !== 0 && (
          <Avatar size="superLarge" className={css({ margin: "0 auto 3rem auto", fontSize: "1.5rem" })}>
            {initialAvatar}
          </Avatar>
        )}

        <Container>
          <form onSubmit={handleSubmitAll}>
            <FlexJustifyBetween>
              {id !== 0 && (
                <Flex className={css({ width: '100%', justifyContent: 'flex-end', paddingBottom: 16  })}>
                  {!editMode?.contact ? (
                    <>
                      <ButtonIcon
                        type="button"
                        onClick={() => toggleEditMode("contact", true)}
                        size="small"
                        bg="primary"
                        color="white"
                      >
                        <PencilIcon width={18} />
                      </ButtonIcon>
                      <ButtonIcon
                        onClick={() => handleSubmitDelete("contact")}
                        type="button"
                        size="small"
                        color="white"
                        bg="red"
                      >
                        <TrashIcon width={18} />
                      </ButtonIcon>
                    </>
                  ) : (
                    <>
                      <ButtonIcon
                        type="button"
                        onClick={() => handleSubmitEditContact()}
                        size="small"
                        bg="primary"
                        color="white"
                      >
                        <CheckIcon width={18} />
                      </ButtonIcon>
                      <ButtonIcon
                        onClick={() => handleCancelEdit("contact")}
                        type="button"
                        size="small"
                        color="white"
                        bg="red"
                      >
                        <CloseIcon width={18} />
                      </ButtonIcon>
                    </>
                  )}
                </Flex>
              )}
            </FlexJustifyBetween>
            <Flex>
              <FormControl
                label="First Name"
                type="text"
                value={form.first_name}
                onChange={handleChange}
                fieldName="first_name"
                placeholder="Enter first name"
                disabled={!editMode?.contact && !!id}
                error={errors.first_name}
              />
              <FormControl
                label="Last Name"
                type="text"
                value={form.last_name}
                onChange={handleChange}
                fieldName="last_name"
                placeholder="Enter last name"
                disabled={!editMode?.contact && !!id}
                error={errors.last_name}
              />
            </Flex>
            <FlexJustifyBetween className={css({ marginTop: "1.5rem", })}>
              <Text.H1 size="lg">
                Phone Number
              </Text.H1>
              <Button
                disabled={form.phones.some((phone) => !phone.number)}
                type="button"
                onClick={handleAddPhone}
                className={css({ height: "2rem !important" })}
              >
                + Add
              </Button>

            </FlexJustifyBetween>
            {form.phones.length > 0 ? form.phones.map((phone, index) => (
              <FlexJustifyBetween key={index} >
                <FormControl
                  label={`Phone ${index + 1}`}
                  type="tel"
                  value={phone.number}
                  onChange={handleChange}
                  fieldName={`phones.${index}.number`}
                  placeholder={`Enter phone number`}
                  disabled={!editMode?.[`phone-${index}`] && !!id}
                  error={errors.phones[index]?.number}
                />
                {id ? (
                  <>
                    {!editMode?.[`phone-${index}`] ? (
                      <>
                        <ButtonIcon
                          type="button"
                          onClick={() => toggleEditMode(`phone-${index}`, true)}
                          size="small"
                          bg="primary"
                          color="white"
                        >
                          <PencilIcon width={18} />
                        </ButtonIcon>
                        <ButtonIcon
                          onClick={() => handleSubmitDelete(`phone-${index}`, index)}
                          type="button"
                          size="small"
                          color="white"
                          bg="red"
                        >
                          <TrashIcon width={18} />
                        </ButtonIcon>
                      </>
                    ) : (
                      <>
                        <ButtonIcon
                          type="button"
                          onClick={() => handleSubmitPhone(index)}
                          size="small"
                          bg="primary"
                          color="white"
                        >
                          <CheckIcon width={18} />
                        </ButtonIcon>
                        < ButtonIcon
                          onClick={() => handleCancelEdit(`phone-${index}`, index)}
                          type="button"
                          size="small"
                          color="white"
                          bg="red"
                        >
                          <CloseIcon width={18} />
                        </ButtonIcon>
                      </>
                    )}
                  </>
                ) : (
                  <ButtonIcon
                    onClick={() => handleSubmitDeletePhone(index)}
                    type="button"
                    size="small"
                    color="white"
                    bg="red"
                  >
                    <TrashIcon width={18} />
                  </ButtonIcon>
                )}
              </FlexJustifyBetween>
            )) : (
              <TextMuted>No phone number</TextMuted>
            )}
            {!id && (
              <Button disabled={loadingAdd} className={css({ marginTop: "1rem" })} type="submit" width={"100%"}>Submit</Button>
            )}
          </form>
        </Container>
      </MainContent >

      <ModalDelete
        isOpen={deleteProps?.isOpen || false}
        message={deleteProps?.message}
        onClose={() => setDeleteProps({ isOpen: false })}
        onConfirm={deleteProps?.onConfirm}
      />
    </>
  )
}

export default ContactForm;
