import React, { SetStateAction } from 'react';
import { Paper } from '@mui/material';
import styles from '../styles/Edit.module.css';
import { Button } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { useSession } from 'next-auth/react';
import Loading from './Loading';

import {
	Option as OptionTS,
	Select,
	Form,
	Input,
	Select as SelectTS,
	CheckBox,
} from '@prisma/client';
import Option from './Option';

const SelectOptions = ({
	select,
	setLoading,
	forms,
	loading,
	index,
	selectIndex,
	setForms,
	close,
}: {
	select: Select & { options: OptionTS[] };
	setLoading: React.Dispatch<SetStateAction<boolean>>;
	forms: (Form & {
		inputs: Input[];
		selects: (SelectTS & { options: OptionTS[] })[];
		checkboxes: CheckBox[];
	})[];
	loading: boolean;
	index: number;
	selectIndex: number;
	setForms: React.Dispatch<
		SetStateAction<
			(Form & {
				inputs: Input[];
				selects: (SelectTS & { options: OptionTS[] })[];
				checkboxes: CheckBox[];
			})[]
		>
	>;
	close: () => void;
}) => {
	const { data: session } = useSession();
	return (
		<div style={{ position: 'fixed' }} className={styles.container}>
			<Paper
				style={{
					position: 'relative',
					padding: '20px',
					paddingBottom: '20px',
					display: 'flex',
					flexDirection: 'column',
					alignContent: 'center',
					height: '90vh',
					width: '21rem',
					minWidth: '50%',
					maxWidth: '90vw',
					maxHeight: '90%',
				}}
				elevation={3}>
				<h1 style={{ textAlign: 'center', marginTop: 0 }}>Options:</h1>
				{session?.user?.admin ? (
					<>
						<div
							style={{
								height: '100%',
								maxHeight: '100%',
							}}>
							{select.options.length === 0 ? (
								<div
									style={{
										display: 'flex',
										padding: '10px',
										justifyContent: 'center',
										width: '15rem',
									}}>
									{'No options :('}
								</div>
							) : (
								<div
									style={{
										overflowY: 'auto',
										height: '95%',
										maxHeight: '87%',
										width: '100%',
									}}>
									{select.options.map(
										(inp: OptionTS, inpIndex: number) => {
											return (
												<Option
													key={inp.id}
													setLoading={setLoading}
													forms={forms}
													loading={loading}
													index={index}
													selectIndex={selectIndex}
													setForms={setForms}
													inp={inp}
													inpIndex={inpIndex}
												/>
											);
										}
									)}
								</div>
							)}
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
								}}>
								<Button
									disabled={loading}
									variant='contained'
									style={{
										borderBottomRightRadius: '0px',
										borderTopRightRadius: '0px',
									}}
									onClick={async () => {
										setLoading(true);

										await fetch('/api/admin/updateoption', {
											method: 'POST',
											body: JSON.stringify({
												options: select.options,
											}),
										});

										await fetch('/api/admin/createoption', {
											method: 'POST',
											body: JSON.stringify({
												value: 'New Option',
												selectId: select.id,
											}),
										});
										let options =
											forms[index].selects[selectIndex]
												.options;
										await fetch('/api/admin/getforms')
											.then((response) => response.json())
											.then((data) => {
												options.push(
													data[index].selects[
														selectIndex
													].options.at(-1)
												);
											});
										setLoading(false);

										setForms((prev) => {
											let updatedList = prev;
											updatedList[index].selects[
												selectIndex
											].options = options;

											return [...updatedList];
										});
									}}>
									Add Option
								</Button>
							</div>
						</div>
					</>
				) : (
					<Loading />
				)}

				<CancelIcon
					style={{
						position: 'absolute',
						top: '10px',
						right: '10px',
						cursor: 'pointer',
					}}
					fontSize='large'
					onClick={async () => {
						setLoading(true);
						await fetch('/api/admin/updateoption', {
							method: 'POST',
							body: JSON.stringify({
								options: select.options.map((option) => {
									return {
										id: option.id,
										value: option.value,
										selectId: option.selectId,
									};
								}),
							}),
						});
						await fetch('/api/admin/getforms')
							.then((response) => response.json())
							.then((data) => setForms(data));
						close();
						setLoading(false);
					}}
				/>
			</Paper>
		</div>
	);
};

export default SelectOptions;
