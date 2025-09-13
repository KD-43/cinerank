import { SearchMedia } from "./SearchMediaComponent";

export default function RightSide ({ actions, checks }) {

    const { addItem } = actions;
    const { checkItemExists } = checks;

    return (
        <div className="rightSideContent_wrapper">
            <div className="searchMedia_wrapper d-flex align-items-center flex-column">
                <SearchMedia addItem={addItem} checkItemExists={checkItemExists} />
            </div>
        </div>
    )
}