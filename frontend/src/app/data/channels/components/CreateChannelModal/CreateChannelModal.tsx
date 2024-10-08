import React from 'react'
import { postData } from '@/api/apiHelpers'
import { Stack, Text, Modal, Button, Tooltip, TextInput } from '@mantine/core'
import { useState } from 'react'
import styles from './CreateChannelModal.module.css'
import { useDisclosure } from '@mantine/hooks'
import { IconUserCircle } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { CHANNELS_URL } from '@/api'

export interface CreateChannelModalProps {
  fetchChannels: () => void
  setTicketID: (ticketID: string) => void
  setIsPolling: (isPolling: boolean) => void
}

export function CreateChannelModal({
  fetchChannels,
  setTicketID,
  setIsPolling,
}: CreateChannelModalProps) {
  const [channelName, setChannelName] = useState<string | undefined>(undefined)
  const [opened, { open, close }] = useDisclosure(false)

  const handleSubmit = async () => {
    if (isSubmitDisabled) {
      return
    }

    const formData = new FormData()
    formData.append('name', channelName)

    const response = await postData(CHANNELS_URL, formData)
    if (response.status == 201) {
      const data = await response.json()
      setTicketID(data.ticket)
      setIsPolling(true)

      notifications.show({
        title: 'Channel creation task Sent',
        message: `Ticket: ${data.ticket}`,
      })
      fetchChannels()
      close()
    }
  }

  const handleChannelChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setChannelName(event.target.value)
  }
  const isSubmitDisabled = !channelName

  return (
    <>
      <Modal.Root
        opened={opened}
        onClose={close}
        centered
        className={styles.modalRoot}
      >
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>
              <Text size="xl">Create Channel</Text>
            </Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <Stack>
              <TextInput
                label={'Channel Name'}
                onChange={handleChannelChange}
                value={channelName ? channelName : ''}
              />
              <Tooltip
                label={
                  isSubmitDisabled
                    ? 'Choose a format first.'
                    : 'Submit to Queue'
                }
              >
                <Button disabled={isSubmitDisabled} onClick={handleSubmit}>
                  Submit
                </Button>
              </Tooltip>
            </Stack>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
      <Tooltip label="Create Channel">
        <Button onClick={open}>
          Create Channel
          <IconUserCircle size={20} />
        </Button>
      </Tooltip>
    </>
  )
}
