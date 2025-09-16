import {
	Accordion,
	Button,
	Checkbox,
	Combobox,
	Input,
	InputBase,
	Loader,
	NumberInput,
	Select,
	Stack,
	Text,
	Tooltip,
	useCombobox,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconScanEye } from "@tabler/icons-react";
import { useState } from "react";
import { getData, postData } from "@/api/apiHelpers";
import { BaseModal } from "@/components/modal/BaseModal";
import type { EmoteSet } from "@/lib/types";

export interface PreprocessModalProps {
	parentIds: Set<number>;
}

export function PreprocessModal({ parentIds }: Readonly<PreprocessModalProps>) {
	const [useEmotes, setUseEmotes] = useState<boolean | undefined>(false);
	const [useSentiment, setUseSentiment] = useState<boolean | undefined>(false);
	const [filterEmotes, setFilterEmotes] = useState<boolean | undefined>(false);
	const [minWords, setMinWords] = useState<string | number>(1);
	const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
	const [selectedSet, setSelectedSet] = useState<string | null>(null);
	const [comboBoxLoading, setComboBoxLoading] = useState(false);
	const [emoteSets, setEmoteSets] = useState<EmoteSet[]>([]);
	const [_opened, { open, close }] = useDisclosure(false);

	const getEmoteSets = async () => {
		const response = await getData("chat/emotesets");
		return response.json();
	};

	const comboboxLogic = useCombobox({
		onDropdownClose: () => comboboxLogic.resetSelectedOption(),
		onDropdownOpen: () => {
			if (emoteSets.length === 0 && !comboBoxLoading) {
				setComboBoxLoading(true);
				getEmoteSets().then((response) => {
					setEmoteSets(response);
					setComboBoxLoading(false);
					comboboxLogic.resetSelectedOption();
				});
			}
		},
	});

	const handleSubmit = async () => {
		const formData = new FormData();
		formData.append("parentIds", JSON.stringify(Array.from(parentIds)));
		formData.append("format", selectedFormat || "");
		formData.append("useSentiment", String(useSentiment));
		formData.append("useEmotes", String(useEmotes));
		formData.append("emoteSet", selectedSet ? selectedSet.toString() : "");
		formData.append("filterEmotes", String(useEmotes && filterEmotes));
		formData.append("minWords", minWords.toString());

		const response = await postData(`chat/files/preprocess/`, formData);
		if (response.ok) {
			const data = await response.json();
			notifications.show({
				title: "Preprocess Task Sent",
				message: `Ticket: ${data.ticket}`,
			});
			close();
		}
	};

	const comboboxOptions = emoteSets.map((item) => (
		<Combobox.Option value={item.name} key={item.id}>
			{item.name}
		</Combobox.Option>
	));

	const isSubmitDisabled = !selectedFormat || (useEmotes && !selectedSet);

	return (
		<>
			<BaseModal title="Preprocess Logs">
				<Stack>
					<Accordion multiple>
						<Accordion.Item key="format" value="format">
							<Accordion.Control>
								{<Text size="xl">Format</Text>}
							</Accordion.Control>
							<Accordion.Panel>
								<Select
									label="Log Format"
									data={["Chatterino", "Rustlog"]}
									value={selectedFormat}
									onChange={(value) => setSelectedFormat(value)}
								/>
							</Accordion.Panel>
						</Accordion.Item>
						<Accordion.Item key="features" value="features">
							<Accordion.Control>
								{<Text size="xl">Features</Text>}
							</Accordion.Control>
							<Accordion.Panel>
								<Stack>
									<Checkbox
										label={"Use Sentiment Analysis"}
										checked={useSentiment}
										onChange={(event) =>
											setUseSentiment(event.currentTarget.checked)
										}
									/>
									<NumberInput
										label="Minimum Words"
										disabled={!useSentiment}
										value={minWords}
										onChange={setMinWords}
									/>

									<Checkbox
										label={"Use 7TV Emotes"}
										checked={useEmotes}
										onChange={(event) =>
											setUseEmotes(event.currentTarget.checked)
										}
									/>
									<Text c={useEmotes ? "" : "dimmed"}>Emote Set</Text>
									<Combobox
										disabled={!useEmotes}
										store={comboboxLogic}
										withinPortal={false}
										onOptionSubmit={(val) => {
											setSelectedSet(val);
											comboboxLogic.closeDropdown();
										}}
									>
										<Combobox.Target>
											<InputBase
												component="button"
												type="button"
												pointer
												rightSection={
													comboBoxLoading ? (
														<Loader size={18} />
													) : (
														<Combobox.Chevron />
													)
												}
												onClick={() => comboboxLogic.toggleDropdown()}
												rightSectionPointerEvents="none"
											>
												{selectedSet || (
													<Input.Placeholder>Pick value</Input.Placeholder>
												)}
											</InputBase>
										</Combobox.Target>

										<Combobox.Dropdown>
											<Combobox.Options>
												{comboBoxLoading ? (
													<Combobox.Empty>Loading....</Combobox.Empty>
												) : (
													comboboxOptions
												)}
											</Combobox.Options>
										</Combobox.Dropdown>
									</Combobox>
									<Checkbox
										disabled={!useEmotes || !useSentiment}
										label={"Filter Emotes for Sentiment Analysis"}
										checked={filterEmotes}
										defaultChecked={false}
										onChange={(event) =>
											setFilterEmotes(event.currentTarget.checked)
										}
									/>
								</Stack>
							</Accordion.Panel>
						</Accordion.Item>
					</Accordion>
					<Tooltip
						label={
							isSubmitDisabled ? "Choose a format first." : "Submit to Queue"
						}
					>
						<Button disabled={isSubmitDisabled} onClick={handleSubmit}>
							Submit
						</Button>
					</Tooltip>
				</Stack>
			</BaseModal>
			<Tooltip label="Preprocess">
				<Button onClick={open}>
					Preprocess
					<IconScanEye size={20} />
				</Button>
			</Tooltip>
		</>
	);
}
