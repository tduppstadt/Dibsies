echo " "
echo "_______________ DIBSIES DEVELOPMENT BUILD MENU _______________"
echo " "
echo "1.  Production - Download"
echo "    - theme download --env prod"
echo ""
echo "2.  Production - Update"
echo "    - theme update --env prod"
echo ""
echo "3.  Production - Watch"
echo "    - theme watch --env prod"
echo ""
echo "______"
echo ""
echo "4.  Development - Download"
echo "    - theme download --env dev"
echo ""
echo "5.  Development - Update"
echo "    - theme update --env dev"
echo ""
echo "6.  Development - Watch"
echo "    - theme watch --env dev"
echo ""
echo "0.  Cancel"
echo ""
echo "_______________"
echo ""

read -p "Option > " choice


if [ $choice -eq 0 ]; then
	exit 0
fi

echo ""
echo "Executing ..."
echo ""

if [ $choice -eq 1 ]; then
	theme download --env prod;
	echo " "
	echo "__ Production Download Completed __"
	echo " "
fi

if [ $choice -eq 2 ]; then
	theme update --env prod;
	echo " "
	echo "__ Production Update Completed __"
	echo " "
fi

if [ $choice -eq 3 ]; then
	echo "Production Watching ... "
	theme watch --env prod;
fi

if [ $choice -eq 4 ]; then
	theme download --env dev;
	echo " "
	echo "__ Development Download Completed __"
	echo " "
fi

if [ $choice -eq 5 ]; then
	theme update --env dev;
	echo " "
	echo "__ Development Update Completed __"
	echo " "
fi

if [ $choice -eq 6 ]; then
	echo "Development Watching ... "
	theme watch --env dev;
fi
