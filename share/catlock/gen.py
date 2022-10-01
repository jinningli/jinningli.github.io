color_list = [
"white",
"#3E5C7A",
"dark grey",
"Apple purple",
"Apple Gold",
"Apple Silver",
"Apple Black",
"#F9A647",
"#185864",
"#E2DBD0",
"#515792",
"#515792",
"#E4A5B3",
"#93C9EF",
"#D7E4F4",
"#E9CAA6",
"#013E29",
"#729955",
"#729955",
"#9F9C9A",
"#9F9C9A",
"#2F364A",
"#525D6D",
"#794E42",
"#794E42",
"#467398",
"#516536"
]


with open("res.txt", "w") as fout:
    for i in range(1, 28):
        fout.write("<br>\n<a>[No.{}] \t Color:{}</a>\n<br>\n<img src=\"Slide{}.jpeg\" alt=\"Slide{}.jpeg\" width=\"128\">\n<br>\n<br>".format(i, color_list[i - 1], i, i))
