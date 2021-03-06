import { Coords } from 'google-map-react';
import { Moment } from 'moment';
import * as React from 'react';
import { SFC } from 'react';

import Button from '../Button/Button';
import DatePicker from '../DatePicker/DatePicker';
import ImageDropzone from '../ImageDropzone/ImageDropzone';
import LocationPicker from '../LocationPicker/LocationPicker';
import RadioSelect from '../RadioSelect/RadioSelect';

import * as styles from './AddSticker.scss';

interface AddStickerProps {
    image: File;
    setImage: (image: File) => void;
    type: 'placed' | 'spotted';
    setType: (type: string) => void;
    date: Moment;
    setDate: (date: Moment) => void;
    coords: Coords;
    setCoords: (coords: Coords) => void;
    mapCenter: Coords;
    setMapCenter: (center: Coords) => void;
    submitForm: () => void;
    errors: string[];
    disableSubmit: boolean;
}

const errorClass = (errors: string[], field: string) =>
    errors.indexOf(field) !== -1 ? styles.rowError : styles.rowErrorHide;

const AddSticker: SFC<AddStickerProps> = ({
    image,
    setImage,
    type,
    setType,
    date,
    setDate,
    coords,
    setCoords,
    mapCenter,
    setMapCenter,
    submitForm,
    errors,
    disableSubmit,
}) => (
    <div className={styles.container}>
        <h2 className={styles.heading}>Add sticker</h2>

        <div className={styles.row}>
            <ImageDropzone
                image={image}
                onChange={setImage}
            />
        </div>

        <div className={image ? styles.row : styles.rowDisabled}>
            <div className={styles.rowHeading}>Did you place or spot this sticker?</div>
            <div className={errorClass(errors, 'type')}>Just answer the damn question.</div>
            <RadioSelect
                options={{
                    placed: <span>Placed</span>,
                    spotted: <span>Spotted</span>,
                }}
                value={type}
                onChange={setType}
            />
        </div>

        <div className={image ? styles.row : styles.rowDisabled}>
            <div className={styles.rowHeading}>Date</div>
            <div className={errorClass(errors, 'date')}>Date is required.</div>
            <DatePicker
                value={date}
                onChange={setDate}
            />
        </div>

        <div className={image ? styles.row : styles.rowDisabled}>
            <div className={styles.rowHeading}>Location</div>
            <div className={errorClass(errors, 'location')}>Pick a location on the map.</div>
            <LocationPicker
                coords={coords}
                center={mapCenter}
                onChange={setCoords}
                onChangeCenter={setMapCenter}
            />
        </div>

        <div className={(image && !disableSubmit) ? styles.row : styles.rowDisabled}>
            <Button primary onClick={submitForm}>Add sticker</Button>
        </div>
    </div>
);

export default AddSticker;
