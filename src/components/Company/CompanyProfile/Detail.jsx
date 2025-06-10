import {
    CheckOutlined,
    FacebookOutlined,
    LinkedinOutlined,
    MailOutlined,
    MehOutlined,
    PhoneOutlined,
} from "@ant-design/icons";

function Detail({ companyData }) {
    console.log(companyData);
    return (
        <>
            <div className="col-span-3">
                <div className="font-light">
                    <h1 className="font-semibold">
                        About {companyData.companyName}
                    </h1>
                    <div className="whitespace-pre-line text-gray-700 leading-relaxed text-justify">
                        {companyData.aboutUs}
                    </div>
                </div>
                <div className="font-light mt-5">
                    <h1 className="font-semibold">Company Size</h1>
                    <h1>{companyData.companySize} Members</h1>
                </div>
                <div className="font-light mt-5">
                    <h1 className="font-semibold">Benefit</h1>
                    {companyData.benefit.map((ben, index) => (
                        <div key={index} className="flex gap-2 my-2">
                            <div className="text-indigo-700">
                                <CheckOutlined className="bg-indigo-200 rounded-full p-1 text-xs" />{" "}
                            </div>
                            <div>{ben}</div>
                        </div>
                    ))}
                </div>
                <div className="relative w-full">
                    <div className="overflow-x-auto scroll-smooth">
                        <div className="flex">
                            {companyData.albumImage.map((img, index) => (
                                <div
                                    key={index}
                                    className="w-full sm:w-1/2 md:w-1/3 p-2 flex-shrink-0"
                                >
                                    <img
                                        src={img}
                                        alt={`Image ${index}`}
                                        className="w-full h-48 object-cover rounded-xl shadow"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Detail;
