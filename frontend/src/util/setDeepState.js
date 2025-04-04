export default function setDeepState(setState) {
    return (key, value) => {
        setState(prev => ({
            ...prev, [key]: value
        }))
    }
}