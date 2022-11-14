import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import {
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Select,
	MenuItem,
	TextField,
	Switch,
	useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from '../styles/AdminForms.module.css';

const AdminForms = () => {
	const { palette } = useTheme();
	const { data: session } = useSession();
	const [forms, setForms] = useState<any[]>([]);

	useEffect(() => {
		if (session?.user.admin) {
			fetch('/api/admin/getforms')
				.then((response) => response.json())
				.then((data) => setForms(data));
		}
	}, [session?.user.admin]);

	return (
		<div>
			{forms.map((el, index) => (
				<Accordion key={index}>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						{el?.id}
					</AccordionSummary>
					<AccordionDetails>
						{el.inputs.map((input: any, inputIndex: number) => {
							const numberOfOptions =
								el.inputs.length +
								el.selects.length +
								el.checkboxes.length;
							console.log(input);
							return (
								<>
									<div
										key={inputIndex}
										className={styles.inputEdit}
										style={{
											border: `2px solid ${palette.primary.main}`,
										}}>
										<div>
											<span
												style={{
													fontWeight: 'bold',
													marginTop: 'auto',
												}}>
												Order
											</span>
											<span>
												<Select
													value={
														forms[index].inputs[
															inputIndex
														].order
													}
													size='small'
													onChange={(event) =>
														setForms((prev) => {
															let updatedList =
																prev;
															updatedList[
																index
															].inputs[
																inputIndex
															].order =
																event.target.value;
															return [
																...updatedList,
															];
														})
													}>
													{Array.from(
														Array(
															numberOfOptions
														).keys()
													).map(
														(
															el: number,
															index: number
														) => (
															<MenuItem
																key={index}
																value={el}>
																{el}
															</MenuItem>
														)
													)}
												</Select>
											</span>
										</div>
										<div>
											<span
												style={{
													fontWeight: 'bold',
													marginTop: 'auto',
												}}>
												Label
											</span>
											<span>
												<TextField
													size='small'
													value={
														forms[index].inputs[
															inputIndex
														]?.label
													}
													onChange={(event) =>
														setForms((prev) => {
															let updatedList =
																prev;
															updatedList[
																index
															].inputs[
																inputIndex
															].label =
																event.target.value;
															return [
																...updatedList,
															];
														})
													}
												/>
											</span>
										</div>
										<div>
											<span
												style={{
													fontWeight: 'bold',
													marginTop: 'auto',
												}}>
												Placeholder
											</span>
											<span>
												<TextField
													size='small'
													value={
														forms[index].inputs[
															inputIndex
														]?.placeholder
													}
													onChange={(event) =>
														setForms((prev) => {
															let updatedList =
																prev;
															updatedList[
																index
															].inputs[
																inputIndex
															].placeholder =
																event.target.value;
															return [
																...updatedList,
															];
														})
													}
												/>
											</span>
										</div>
										<div>
											<span
												style={{
													fontWeight: 'bold',
													marginTop: 'auto',
												}}>
												Required
											</span>
											<span>
												<Switch
													checked={
														forms[index].inputs[
															inputIndex
														]?.required
													}
													onChange={() =>
														setForms((prev) => {
															let updatedList =
																prev;
															updatedList[
																index
															].inputs[
																inputIndex
															].required =
																!updatedList[
																	index
																].inputs[
																	inputIndex
																].required;
															return [
																...updatedList,
															];
														})
													}
												/>
											</span>
										</div>
										<div>
											<span
												style={{
													fontWeight: 'bold',
													marginTop: 'auto',
												}}>
												Type
											</span>
											<span>
												<Select
													value={
														forms[index].inputs[
															inputIndex
														].type
													}
													size='small'
													onChange={(event) =>
														setForms((prev) => {
															let updatedList =
																prev;
															updatedList[
																index
															].inputs[
																inputIndex
															].type =
																event.target.value;
															return [
																...updatedList,
															];
														})
													}>
													{[
														'text',
														'email',
														'number',
														'password',
														'color',
													].map(
														(
															el: string,
															index: number
														) => (
															<MenuItem
																key={index}
																value={el}>
																{el}
															</MenuItem>
														)
													)}
												</Select>
											</span>
										</div>
									</div>
								</>
							);
						})}
					</AccordionDetails>
				</Accordion>
			))}
		</div>
	);
};

export default AdminForms;
