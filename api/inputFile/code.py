def tradingAgorithm(prices, indexStart, length):
    indexEnd = indexStart + length
    
    moving_average = sum(prices[indexStart:indexEnd])

    current_price = prices[indexStart + length - 1]
    if current_price > moving_average:
        print("helo")
    elif current_price < moving_average:
        print("bro")
    else:
        print("hold")


