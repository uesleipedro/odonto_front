const TimeLine = ({ evolucoes }) => {
    return (
        <ol class="border-s border-neutral-300 dark:border-neutral-500">
            {evolucoes?.map((e) => (
                <li>
                    <div class="flex-start flex items-center pt-3">
                        <div
                            class="-ms-[5px] me-3 h-[9px] w-[9px] rounded-full bg-neutral-300 dark:bg-neutral-500"></div>
                        <p class="text-sm text-neutral-500 dark:text-neutral-300">
                            01.07.2021
                        </p>
                    </div>
                    <div class="mb-6 ms-4 mt-2">
                        <p class="mb-3 text-neutral-500 dark:text-neutral-300">{e.texto}</p>
                        <p>Dr. Fulano</p>
                    </div>
                </li>
            ))}
        </ol>
    )
}

export default TimeLine