
type Props = {
    toggle: () => void;
};

export default function EditModeButton({ toggle }: Props) {

    return <button
        style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 50,
            height: 50,
            backgroundColor: '#007bff',
            border: 'none',
            borderRadius: 25,
            cursor: 'pointer',
            zIndex: 2000,
        }}

        onClick={() => toggle()}

    >
        +
    </button >;
};

